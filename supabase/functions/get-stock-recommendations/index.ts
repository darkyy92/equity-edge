import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "./utils/cors.ts";
import { transformTimeframe } from "./utils/timeframe.ts";
import { getAIRecommendations } from "./utils/openai.ts";
import { getCachedRecommendations, upsertRecommendations } from "./utils/database.ts";

serve(async (req) => {
  console.log('Request received:', req.method);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { timeframe = 'short-term', refresh = false } = await req.json();
    const dbTimeframe = transformTimeframe(timeframe);
    console.log('Processing request for timeframe:', timeframe, '→', dbTimeframe, 'refresh:', refresh);

    // Only check cache if refresh is false
    if (!refresh) {
      const cachedRecs = await getCachedRecommendations(dbTimeframe);

      // Return cached data if fresh enough and not forcing refresh
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
    }

    console.log('Getting fresh recommendations from OpenAI');
    // Get new recommendations from OpenAI
    const recommendations = await getAIRecommendations(timeframe);
    
    // Store recommendations in database
    await upsertRecommendations(recommendations, dbTimeframe);

    return new Response(
      JSON.stringify({ data: { recommendations } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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