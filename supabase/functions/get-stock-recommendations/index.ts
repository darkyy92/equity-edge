import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const MARKETSTACK_API_KEY = Deno.env.get('MARKETSTACK_API_KEY');

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
          console.log('Fetching MarketStack data for:', rec.symbol);
          const response = await fetch(
            `http://api.marketstack.com/v1/eod?access_key=${MARKETSTACK_API_KEY}&symbols=${rec.symbol}&limit=1`
          );

          if (!response.ok) {
            console.error(`Failed to fetch MarketStack data for ${rec.symbol}`);
            throw new Error(`Failed to fetch data for ${rec.symbol}`);
          }

          const data = await response.json();
          const latestPrice = data.data[0];

          if (!latestPrice) {
            console.error(`Invalid MarketStack response for ${rec.symbol}`);
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
            price: latestPrice.close,
            change: latestPrice.close - latestPrice.open,
            changePercent: ((latestPrice.close - latestPrice.open) / latestPrice.open) * 100,
            volume: latestPrice.volume,
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