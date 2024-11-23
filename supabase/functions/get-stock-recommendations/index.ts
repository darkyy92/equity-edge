import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting get-stock-recommendations function');
    const { timeframe = 'short' } = await req.json();

    // 1. Get AI recommendations
    console.log('Fetching AI recommendations for timeframe:', timeframe);
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
            content: 'You are a financial analyst. Return a JSON array of objects, each containing: symbol (stock ticker), reason (brief explanation), confidence (0-100), potentialGrowth (-100 to 100). Format your entire response as valid JSON.'
          },
          {
            role: 'user',
            content: `Recommend 9 stocks for ${timeframe}-term investment. Return ONLY a JSON array.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      console.error('OpenAI API error:', await aiResponse.text());
      throw new Error('Failed to get AI recommendations');
    }

    const aiData = await aiResponse.json();
    if (!aiData.choices?.[0]?.message?.content) {
      console.error('Invalid AI response format:', aiData);
      throw new Error('Invalid AI response format');
    }

    const recommendations = JSON.parse(aiData.choices[0].message.content);
    console.log('Got AI recommendations:', recommendations);

    // 2. Fetch stock details from Polygon
    const enrichedRecommendations = await Promise.all(
      recommendations.stocks.map(async (rec: any) => {
        try {
          console.log('Fetching Polygon data for:', rec.symbol);
          const [detailsResponse, priceResponse] = await Promise.all([
            fetch(`https://api.polygon.io/v3/reference/tickers/${rec.symbol}?apiKey=${POLYGON_API_KEY}`),
            fetch(`https://api.polygon.io/v2/aggs/ticker/${rec.symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`)
          ]);

          if (!detailsResponse.ok || !priceResponse.ok) {
            console.error(`Failed to fetch Polygon data for ${rec.symbol}:`, 
              await Promise.all([detailsResponse.text(), priceResponse.text()]));
            throw new Error(`Failed to fetch data for ${rec.symbol}`);
          }

          const details = await detailsResponse.json();
          const price = await priceResponse.json();

          if (!details.results || !price.results?.[0]) {
            console.error(`Invalid Polygon response for ${rec.symbol}:`, { details, price });
            throw new Error(`Invalid data format for ${rec.symbol}`);
          }

          return {
            ...rec,
            name: details.results.name,
            isin: details.results.isin,
            valor_number: details.results.valor_number,
            price: price.results[0].c,
            change: price.results[0].c - price.results[0].o,
            changePercent: ((price.results[0].c - price.results[0].o) / price.results[0].o) * 100,
            volume: price.results[0].v,
            vwap: price.results[0].vw,
          };
        } catch (error) {
          console.error(`Error processing ${rec.symbol}:`, error);
          return {
            ...rec,
            error: true,
            errorMessage: error.message
          };
        }
      })
    );

    console.log('Enriched recommendations:', enrichedRecommendations);

    // Filter out recommendations with errors
    const validRecommendations = enrichedRecommendations.filter((rec: any) => !rec.error);
    
    if (validRecommendations.length === 0) {
      throw new Error('No valid stock recommendations could be generated');
    }

    return new Response(
      JSON.stringify({
        recommendations: validRecommendations
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