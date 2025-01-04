import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { StockRecommendation } from './openai.ts';
import { Timeframe } from './timeframe.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const upsertRecommendations = async (recommendations: StockRecommendation[], dbTimeframe: Timeframe) => {
  for (const rec of recommendations) {
    const { error: upsertError } = await supabase
      .from('stock_recommendations')
      .upsert({
        symbol: rec.symbol,
        strategy_type: dbTimeframe,
        explanation: rec.reason,
        confidence_metrics: { confidence: rec.confidence },
        [`${dbTimeframe}_term_analysis`]: {
          potentialGrowth: rec.potentialGrowth,
          timeframe: dbTimeframe
        },
        primary_drivers: rec.primaryDrivers,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'symbol,strategy_type'
      });

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw new Error(`Database error: ${upsertError.message}`);
    }
  }
};

export const getCachedRecommendations = async (dbTimeframe: Timeframe) => {
  const { data: cachedRecs, error: cacheError } = await supabase
    .from('stock_recommendations')
    .select('*')
    .eq('strategy_type', dbTimeframe)
    .order('created_at', { ascending: false })
    .limit(6);

  if (cacheError) {
    console.error('Database error:', cacheError);
    throw new Error(`Database error: ${cacheError.message}`);
  }

  return cachedRecs;
};