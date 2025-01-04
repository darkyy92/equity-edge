import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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

    // Check for recent cached recommendations
    const { data: cachedRecs, error: cacheError } = await supabase
      .from('stock_recommendations')
      .select('*')
      .eq('strategy_type', timeframe)
      .order('created_at', { ascending: false })
      .limit(6);

    if (cacheError) {
      console.error('Error fetching cached recommendations:', cacheError);
    }

    // Use cached data if it's less than 30 minutes old
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
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('OpenAI API response received');

    if (!aiData.choices?.[0]?.message?.content) {
      console.error('Invalid AI response format:', aiData);
      throw new Error('Invalid AI response format');
    }

    let recommendations;
    try {
      const content = aiData.choices[0].message.content.trim();
      console.log('Raw AI response content:', content);
      
      // Try to extract JSON if the response contains additional text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      console.log('Attempting to parse JSON content:', jsonContent);
      recommendations = JSON.parse(jsonContent);
      
      if (!Array.isArray(recommendations)) {
        console.error('Response is not an array:', recommendations);
        throw new Error('Response is not an array');
      }
      
      // Validate each recommendation
      recommendations.forEach((rec: any, index: number) => {
        console.log(`Validating recommendation ${index}:`, rec);
        
        if (!rec.symbol || !rec.reason || 
            typeof rec.confidence !== 'number' || 
            typeof rec.potentialGrowth !== 'number' || 
            !Array.isArray(rec.primaryDrivers)) {
          console.error('Invalid recommendation format at index', index, ':', rec);
          throw new Error(`Invalid recommendation format at index ${index}`);
        }
      });

      // Store recommendations in Supabase
      console.log('Storing recommendations in database');
      for (const rec of recommendations) {
        const analysisField = `${timeframe.split('-')[0]}_term_analysis`;
        
        const { error: upsertError } = await supabase
          .from('stock_recommendations')
          .upsert({
            symbol: rec.symbol,
            strategy_type: timeframe,
            [analysisField]: {
              potentialGrowth: rec.potentialGrowth,
              timeframe: timeframe
            },
            confidence_metrics: {
              confidence: rec.confidence
            },
            explanation: rec.reason,
            primary_drivers: rec.primaryDrivers
          }, {
            onConflict: 'symbol,strategy_type'
          });

        if (upsertError) {
          console.error('Error upserting recommendation:', upsertError);
        }
      }

    } catch (error) {
      console.error('Error processing AI recommendations:', error);
      console.error('Failed content:', aiData.choices[0].message.content);
      throw new Error('Failed to process AI recommendations');
    }

    console.log('Successfully processed recommendations');
    return new Response(
      JSON.stringify({ data: { recommendations } }),
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