import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('Request received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { timeframe = 'short-term' } = await req.json();
    console.log('Processing request for timeframe:', timeframe);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { data: cachedRecs, error: cacheError } = await supabase
      .from('stock_recommendations')
      .select('*')
      .eq('strategy_type', timeframe)
      .order('created_at', { ascending: false })
      .limit(6);

    if (cacheError) {
      console.error('Database error:', cacheError);
      throw new Error(`Database error: ${cacheError.message}`);
    }

    if (cachedRecs?.length > 0) {
      const mostRecent = new Date(cachedRecs[0].created_at);
      if (Date.now() - mostRecent.getTime() < 30 * 60 * 1000) {
        console.log('Returning cached recommendations');
        return new Response(
          JSON.stringify({ data: { recommendations: cachedRecs } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      console.log('Fetching AI recommendations');
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
              content: `You are a financial analyst. Return a raw JSON array of 6 stock recommendations for ${timeframe} investment opportunities. Each object must have exactly these fields and types:
              {
                "symbol": string (stock ticker),
                "reason": string (2-3 sentences explaining why),
                "confidence": number (0-100),
                "potentialGrowth": number (expected percentage growth),
                "primaryDrivers": string[] (3-4 key factors)
              }
              Return ONLY the raw JSON array with no markdown formatting or additional text.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const aiData = await aiResponse.json();
      console.log('Received AI response');

      if (!aiData.choices?.[0]?.message?.content) {
        throw new Error('Invalid AI response format');
      }

      let recommendations;
      try {
        // Clean the response content of any markdown formatting
        const content = aiData.choices[0].message.content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        console.log('Cleaned content:', content);
        recommendations = JSON.parse(content);
        
        if (!Array.isArray(recommendations)) {
          throw new Error('Response is not an array');
        }

        recommendations.forEach((rec, index) => {
          if (!rec.symbol || !rec.reason || 
              typeof rec.confidence !== 'number' || 
              typeof rec.potentialGrowth !== 'number' || 
              !Array.isArray(rec.primaryDrivers)) {
            throw new Error(`Invalid recommendation format at index ${index}`);
          }
        });

        for (const rec of recommendations) {
          const { error: upsertError } = await supabase
            .from('stock_recommendations')
            .upsert({
              symbol: rec.symbol,
              strategy_type: timeframe,
              explanation: rec.reason,
              confidence_metrics: { confidence: rec.confidence },
              [`${timeframe.split('-')[0]}_term_analysis`]: {
                potentialGrowth: rec.potentialGrowth,
                timeframe: timeframe
              },
              primary_drivers: rec.primaryDrivers,
              updated_at: new Date().toISOString()
            });

          if (upsertError) {
            console.error('Database error:', upsertError);
            throw new Error(`Database error: ${upsertError.message}`);
          }
        }

        return new Response(
          JSON.stringify({ data: { recommendations } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Error processing recommendations:', error);
        throw new Error(`Failed to process recommendations: ${error.message}`);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    console.error('Function error:', error);
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