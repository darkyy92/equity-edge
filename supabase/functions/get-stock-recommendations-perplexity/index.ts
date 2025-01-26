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
    const { timeframe } = await req.json();
    
    console.log('Getting recommendations with Perplexity for timeframe:', timeframe);

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
            content: `You are a financial analyst specializing in ${timeframe} stock recommendations. Provide a balanced mix of stock recommendations:
            - 2 well-established, large-cap companies
            - 2 mid-cap companies with solid growth potential
            - 2 small-cap companies with significant upside potential
            For each recommendation, include the stock symbol, company name, reason, confidence level, growth potential, and key drivers.`
          },
          {
            role: 'user',
            content: `Generate 6 diverse stock recommendations for ${timeframe} investment opportunities. Return a JSON array where each object has: symbol, name, reason, confidence (0-100), potentialGrowth (percentage), and primaryDrivers (array of strings).`
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
    const recommendations = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-stock-recommendations-perplexity function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});