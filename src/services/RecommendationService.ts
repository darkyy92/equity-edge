
import { supabase } from "@/integrations/supabase/client";
import { StockTicker } from "@/lib/types/stock";

export interface StockRecommendation {
  id: number;
  symbol: string;
  name: string;
  timeframe: string;
  reason: string;
  confidence: number;
  potentialGrowth: string;
  primaryDrivers: string[];
  entryZone?: string;
  entryZoneExplanation?: string;
  current_price?: number;
  created_at?: string;
}

export const RecommendationService = {
  async getStockRecommendations(timeframe: string = 'short-term'): Promise<StockRecommendation[]> {
    try {
      console.log(`Fetching ${timeframe} recommendations from Supabase`);
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('timeframe', timeframe)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw new Error(`Failed to fetch recommendations: ${error.message}`);
      }

      console.log(`Received ${data?.length || 0} recommendations from Supabase`);
      return data || [];
    } catch (error) {
      console.error('Error in getStockRecommendations:', error);
      throw error;
    }
  },

  convertToStockTicker(recommendation: StockRecommendation): StockTicker {
    return {
      ticker: recommendation.symbol,
      symbol: recommendation.symbol,
      name: recommendation.name,
      market: 'US',
      locale: 'us',
      primary_exchange: 'NYSE',
      type: 'CS',
      active: true,
      currency_name: 'USD',
      cik: '',
      composite_figi: '',
      share_class_figi: '',
      last_updated_utc: recommendation.created_at || new Date().toISOString(),
      price: recommendation.current_price || 0,
      fundamentalMetrics: {},
      technicalSignals: {},
      marketContext: {},
      primaryDrivers: Array.isArray(recommendation.primaryDrivers) 
        ? recommendation.primaryDrivers 
        : [],
      aiAnalysis: {
        potentialGrowth: parseFloat(recommendation.potentialGrowth) || 0,
        confidence: recommendation.confidence,
        reason: recommendation.reason,
        primaryDrivers: Array.isArray(recommendation.primaryDrivers) 
          ? recommendation.primaryDrivers 
          : []
      }
    };
  }
};
