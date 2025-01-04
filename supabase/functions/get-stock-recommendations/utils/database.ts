import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { StockRecommendation } from './openai.ts';
import { Timeframe } from './timeframe.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const upsertRecommendations = async (recommendations: StockRecommendation[], dbTimeframe: Timeframe) => {
  console.log('Upserting recommendations:', { count: recommendations.length, timeframe: dbTimeframe });
  
  for (const rec of recommendations) {
    const { data, error } = await supabase
      .from('stock_recommendations')
      .upsert({
        symbol: rec.symbol,
        name: rec.name, // Store the company name
        strategy_type: dbTimeframe,
        explanation: rec.reason,
        confidence_metrics: { confidence: rec.confidence },
        [`${dbTimeframe}_term_analysis`]: {
          potentialGrowth: rec.potentialGrowth,
          timeframe: dbTimeframe,
          company_name: rec.name // Also store in the analysis object for backwards compatibility
        },
        primary_drivers: rec.primaryDrivers,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'symbol,strategy_type'
      });

    if (error) {
      console.error('Database error during upsert:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Successfully upserted recommendation for:', rec.symbol);
  }
};

export const getCachedRecommendations = async (dbTimeframe: Timeframe) => {
  console.log('Fetching cached recommendations for timeframe:', dbTimeframe);
  
  const { data: cachedRecs, error: cacheError } = await supabase
    .from('stock_recommendations')
    .select('*')
    .eq('strategy_type', dbTimeframe)
    .order('created_at', { ascending: false })
    .limit(6);

  if (cacheError) {
    console.error('Database error during cache fetch:', cacheError);
    throw new Error(`Database error: ${cacheError.message}`);
  }

  console.log('Found cached recommendations:', { count: cachedRecs?.length });
  return cachedRecs;
};