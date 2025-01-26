import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, stockData } = await req.json();
    
    console.log('Analyzing stock with Perplexity:', { symbol, stockData });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst. Analyze the given stock data and provide insights in these categories: strategy, technical analysis, market context, and risks. Be concise and precise.'
          },
          {
            role: 'user',
            content: `Analyze this stock data for ${symbol}: ${JSON.stringify(stockData)}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the analysis into sections
    const sections = {
      strategy: analysis.split('Technical Analysis:')[0].trim(),
      technical: analysis.split('Technical Analysis:')[1].split('Market Context:')[0].trim(),
      market: analysis.split('Market Context:')[1].split('Risks:')[0].trim(),
      risks: analysis.split('Risks:')[1].trim()
    };

    return new Response(JSON.stringify({ generatedAnalysis: sections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-with-perplexity function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});