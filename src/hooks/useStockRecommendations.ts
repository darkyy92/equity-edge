import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StockTicker, FundamentalMetrics, TechnicalSignals, MarketContext } from "@/lib/types/stock";
import { Json } from "@/integrations/supabase/types";

type TimeFrame = "short-term" | "medium-term" | "long-term";

interface StockRecommendation {
  symbol: string;
  name?: string;
  confidence_metrics: {
    confidence: number;
  } | null;
  explanation: string | null;
  fundamental_metrics: Json | null;
  technical_signals: Json | null;
  market_context: Json | null;
  primary_drivers: string[] | null;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  vwap?: number;
  isin?: string;
  valor_number?: string;
}

const transformToStockTicker = (recommendation: StockRecommendation, timeframe: TimeFrame): StockTicker => ({
  ticker: recommendation.symbol,
  symbol: recommendation.symbol,
  name: recommendation.name || recommendation.symbol,
  market: 'US',
  locale: 'us',
  primary_exchange: 'NYSE',
  type: 'CS',
  active: true,
  currency_name: 'USD',
  cik: '',
  composite_figi: '',
  share_class_figi: '',
  last_updated_utc: new Date().toISOString(),
  price: recommendation.price,
  change: recommendation.change,
  changePercent: recommendation.changePercent,
  volume: recommendation.volume,
  vwap: recommendation.vwap,
  isin: recommendation.isin,
  valor_number: recommendation.valor_number,
  fundamentalMetrics: recommendation.fundamental_metrics as FundamentalMetrics | undefined,
  technicalSignals: recommendation.technical_signals as TechnicalSignals | undefined,
  marketContext: recommendation.market_context as MarketContext | undefined,
  primaryDrivers: recommendation.primary_drivers || [],
  aiAnalysis: {
    potentialGrowth: recommendation[`${timeframe.split('-')[0]}_term_analysis`]?.potentialGrowth || 0,
    confidence: recommendation.confidence_metrics?.confidence || 75,
    reason: recommendation.explanation || 'No analysis available at this time',
    primaryDrivers: recommendation.primary_drivers || []
  }
});

const fetchRecommendations = async (timeframe: TimeFrame): Promise<StockTicker[]> => {
  const cacheKey = `recommendations-${timeframe}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
  
  if (cachedData && cacheTimestamp) {
    const now = new Date().getTime();
    const timestamp = parseInt(cacheTimestamp);
    if (now - timestamp < 15 * 60 * 1000) {
      return JSON.parse(cachedData);
    }
  }

  const { data: cachedRecommendations, error: dbError } = await supabase
    .from('stock_recommendations')
    .select('*')
    .eq('strategy_type', timeframe.split('-')[0])
    .order('updated_at', { ascending: false })
    .limit(6);

  if (dbError) throw dbError;

  if (cachedRecommendations && cachedRecommendations.length > 0) {
    const transformedData = cachedRecommendations.map(rec => 
      transformToStockTicker(rec as unknown as StockRecommendation, timeframe)
    );
    
    localStorage.setItem(cacheKey, JSON.stringify(transformedData));
    localStorage.setItem(`${cacheKey}-timestamp`, new Date().getTime().toString());
    
    return transformedData;
  }

  const response = await supabase.functions.invoke('get-stock-recommendations', {
    body: { timeframe: timeframe.split('-')[0] }
  });

  if (response.error) throw response.error;
  
  const transformedData = (response.data.recommendations as StockRecommendation[])
    .map(rec => transformToStockTicker(rec, timeframe));
  
  localStorage.setItem(cacheKey, JSON.stringify(transformedData));
  localStorage.setItem(`${cacheKey}-timestamp`, new Date().getTime().toString());
  
  return transformedData;
};

export const useStockRecommendations = (timeframe: TimeFrame) => {
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', timeframe],
    queryFn: () => fetchRecommendations(timeframe),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (error) {
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch stock recommendations. Please try again later.",
      variant: "destructive",
    });
  }

  return { recommendations, isLoading, error };
};