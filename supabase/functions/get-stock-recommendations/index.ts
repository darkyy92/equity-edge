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
    const { timeframe = 'short-term' } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
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
            content: `You are a financial analyst. Return ONLY a raw JSON array of 6 stock recommendations for ${timeframe} investment opportunities. Each object must have exactly these fields and types:
            {
              "symbol": string (stock ticker),
              "reason": string (2-3 sentences explaining why),
              "confidence": number (0-100),
              "potentialGrowth": number (expected percentage growth),
              "primaryDrivers": string[] (3-4 key factors)
            }
            Focus on diverse sectors and both established and promising companies. Return only the raw JSON array.`
          },
          {
            role: 'user',
            content: `Generate 6 diverse ${timeframe} stock recommendations based on current market conditions and opportunities.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      console.error('OpenAI API error:', await aiResponse.text());
      throw new Error('Failed to get AI recommendations');
    }

    const aiData = await aiResponse.json();
    console.log('OpenAI API response:', aiData);

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(aiData.choices[0].message.content);
      
      if (!Array.isArray(recommendations)) {
        throw new Error('Response is not an array');
      }
      
      recommendations.forEach((rec: any, index: number) => {
        if (!rec.symbol || !rec.reason || typeof rec.confidence !== 'number' || 
            typeof rec.potentialGrowth !== 'number' || !Array.isArray(rec.primaryDrivers)) {
          throw new Error(`Invalid recommendation format at index ${index}`);
        }
      });

    } catch (error) {
      console.error('Error processing AI recommendations:', error);
      throw new Error('Failed to process AI recommendations');
    }

    return new Response(
      JSON.stringify({ recommendations }),
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