import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timeframe = 'short' } = await req.json();

    // 1. Get AI recommendations
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst. Recommend 9 stocks for ${timeframe}-term investment. Return a JSON array with objects containing: symbol, reason, confidence (0-100), potentialGrowth (-100 to 100).`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const aiData = await aiResponse.json();
    const recommendations = JSON.parse(aiData.choices[0].message.content);

    // 2. Fetch stock details from Polygon
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec: any) => {
        try {
          const [detailsResponse, priceResponse] = await Promise.all([
            fetch(`https://api.polygon.io/v3/reference/tickers/${rec.symbol}?apiKey=${POLYGON_API_KEY}`),
            fetch(`https://api.polygon.io/v2/aggs/ticker/${rec.symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`)
          ]);

          if (!detailsResponse.ok || !priceResponse.ok) {
            throw new Error(`Failed to fetch data for ${rec.symbol}`);
          }

          const details = await detailsResponse.json();
          const price = await priceResponse.json();

          return {
            ...rec,
            name: details.results.name,
            isin: details.results.isin,
            valorNumber: details.results.valor_number,
            price: price.results[0].c,
            change: price.results[0].c - price.results[0].o,
            changePercent: ((price.results[0].c - price.results[0].o) / price.results[0].o) * 100,
            volume: price.results[0].v,
            vwap: price.results[0].vw,
          };
        } catch (error) {
          console.error(`Error fetching data for ${rec.symbol}:`, error);
          return {
            ...rec,
            error: true,
          };
        }
      })
    );

    // 3. Store recommendations in Supabase
    const { error: insertError } = await supabase
      .from('stock_recommendations')
      .upsert(
        enrichedRecommendations.map((rec: any) => ({
          symbol: rec.symbol,
          strategy_type: timeframe,
          explanation: rec.reason,
          confidence_metrics: { confidence: rec.confidence },
          [`${timeframe}_term_analysis`]: {
            potentialGrowth: rec.potentialGrowth,
            timeframe
          },
          isin: rec.isin,
          valor_number: rec.valorNumber,
          updated_at: new Date().toISOString()
        }))
      );

    if (insertError) {
      console.error('Error storing recommendations:', insertError);
    }

    // 4. Return enriched recommendations
    return new Response(
      JSON.stringify({
        recommendations: enrichedRecommendations.filter((rec: any) => !rec.error)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in get-stock-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get stock recommendations',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});