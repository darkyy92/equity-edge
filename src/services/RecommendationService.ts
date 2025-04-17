import { supabase } from "@/integrations/supabase/client";
import { StockTicker } from "@/lib/types/stock";
import { Json } from "@/integrations/supabase/types";

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
      
      // Query to get the latest 6 stocks, ordered by creation date descending
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('timeframe', timeframe)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw new Error(`Failed to fetch recommendations: ${error.message}`);
      }

      console.log(`Received ${data?.length || 0} recommendations from Supabase`);
      console.log('Raw Supabase data:', data);
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Transform the data to match StockRecommendation interface
      return data.map(rec => ({
        id: rec.id,
        symbol: rec.symbol,
        name: rec.name,
        timeframe: rec.timeframe,
        reason: rec.reason || '',
        confidence: rec.confidence || 5,
        potentialGrowth: rec.potentialGrowth || '0',
        primaryDrivers: this.extractPrimaryDrivers(rec),
        entryZone: rec.entryZone,
        entryZoneExplanation: rec.entryZoneExplanation,
        current_price: rec.current_price,
        created_at: rec.created_at
      }));
    } catch (error) {
      console.error('Error in getStockRecommendations:', error);
      throw error;
    }
  },

  extractPrimaryDrivers(rec: any): string[] {
    // Handle different possible formats of primaryDrivers in the database
    if (Array.isArray(rec.primaryDrivers)) {
      return rec.primaryDrivers.map((driver: any) => 
        typeof driver === 'string' ? driver : String(driver)
      );
    } 
    
    if (Array.isArray(rec.primary_drivers)) {
      return rec.primary_drivers.map((driver: any) => 
        typeof driver === 'string' ? driver : String(driver)
      );
    }

    // Try to parse JSON if it's stored as a string
    if (typeof rec.primaryDrivers === 'string') {
      try {
        const parsed = JSON.parse(rec.primaryDrivers);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch (e) {
        // If parsing fails, return string as a single item array
        return [rec.primaryDrivers];
      }
    }

    // Same for primary_drivers
    if (typeof rec.primary_drivers === 'string') {
      try {
        const parsed = JSON.parse(rec.primary_drivers);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch (e) {
        return [rec.primary_drivers];
      }
    }

    return [];
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
      entryZone: recommendation.entryZone,
      entryZoneExplanation: recommendation.entryZoneExplanation,
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
