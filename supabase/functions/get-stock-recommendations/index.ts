import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting get-stock-recommendations function');
    const { timeframe = 'short' } = await req.json();

    console.log('Fetching AI recommendations for timeframe:', timeframe);
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst specializing in discovering both established and under-the-radar investment opportunities. Focus on a mix of:
            1. Well-known, stable companies (30% of recommendations)
            2. Mid-cap companies with strong growth potential (40% of recommendations)
            3. Lesser-known small-cap companies with exceptional potential (30% of recommendations)
            
            For each recommendation, provide detailed reasoning focusing on unique competitive advantages, market opportunities, and growth catalysts.`
          },
          {
            role: 'user',
            content: `Generate 6 diverse stock recommendations for ${timeframe}-term investment, including both established and promising lesser-known companies. Include specific growth catalysts and unique opportunities. Return ONLY a JSON object with a recommendations array containing objects with these exact fields: 
            - symbol (stock ticker)
            - reason (brief explanation)
            - confidence (number between 0-100)
            - potentialGrowth (number representing expected percentage growth, can be any positive or negative value)
            - primaryDrivers (array of strings, 3-5 key growth catalysts)`
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

    const parsedResponse = JSON.parse(aiData.choices[0].message.content);
    const recommendations = parsedResponse.recommendations;
    
    if (!Array.isArray(recommendations)) {
      console.error('Invalid recommendations format:', parsedResponse);
      throw new Error('Invalid recommendations format');
    }

    console.log('Got AI recommendations:', recommendations);

    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec: any) => {
        try {
          console.log('Fetching Polygon data for:', rec.symbol);
          const [detailsResponse, priceResponse] = await Promise.all([
            fetch(`https://api.polygon.io/v3/reference/tickers/${rec.symbol}?apiKey=${Deno.env.get('POLYGON_API_KEY')}`),
            fetch(`https://api.polygon.io/v2/aggs/ticker/${rec.symbol}/prev?adjusted=true&apiKey=${Deno.env.get('POLYGON_API_KEY')}`)
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

          const timeframeAnalysis = {
            potentialGrowth: rec.potentialGrowth,
            timeframe,
            confidence: rec.confidence,
            reason: rec.reason
          };

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
            confidence_metrics: {
              confidence: rec.confidence
            },
            [`${timeframe}_term_analysis`]: timeframeAnalysis,
            fundamental_metrics: null,
            technical_signals: null,
            market_context: null,
            primary_drivers: rec.primaryDrivers || []
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

    const validRecommendations = enrichedRecommendations
      .filter((rec: any) => !rec.error)
      .slice(0, 6);
    
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
    return new Response(JSON.stringify({ 
      error: 'Failed to get stock recommendations',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});