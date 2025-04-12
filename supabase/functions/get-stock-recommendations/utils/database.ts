
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { StockRecommendation } from './openai.ts';
import { Timeframe } from './timeframe.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const upsertRecommendations = async (recommendations: StockRecommendation[], dbTimeframe: Timeframe) => {
  console.log('[Database] Upserting recommendations:', { 
    count: recommendations.length, 
    timeframe: dbTimeframe 
  });
  
  for (const rec of recommendations) {
    console.log(`[Database] Processing recommendation for ${rec.symbol}:`, {
      name: rec.name,
      timeframe: dbTimeframe
    });

    const { data, error } = await supabase
      .from('stock_recommendations')
      .upsert({
        symbol: rec.symbol,
        name: rec.name,
        timeframe: dbTimeframe,
        reason: rec.reason,
        confidence: rec.confidence,
        potentialGrowth: rec.potentialGrowth,
        primaryDrivers: rec.primaryDrivers,
        entryZone: rec.entryZone,
        entryZoneExplanation: rec.entryZoneExplanation,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'symbol,timeframe'
      });

    if (error) {
      console.error('[Database] Error during upsert:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`[Database] Successfully upserted recommendation for: ${rec.symbol}`);
  }
};

export const getCachedRecommendations = async (dbTimeframe: Timeframe) => {
  console.log('[Database] Fetching cached recommendations for timeframe:', dbTimeframe);
  
  const { data: cachedRecs, error: cacheError } = await supabase
    .from('stock_recommendations')
    .select('*')
    .eq('timeframe', dbTimeframe)
    .order('created_at', { ascending: false })
    .limit(6);

  if (cacheError) {
    console.error('[Database] Error during cache fetch:', cacheError);
    throw new Error(`Database error: ${cacheError.message}`);
  }

  console.log('[Database] Found cached recommendations:', { 
    count: cachedRecs?.length,
    recommendations: cachedRecs?.map(rec => ({
      symbol: rec.symbol,
      name: rec.name
    }))
  });
  
  return cachedRecs;
};
