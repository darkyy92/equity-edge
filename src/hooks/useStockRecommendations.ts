import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "@/lib/types/stock";

type TimeFrame = "short-term" | "medium-term" | "long-term";

export const useStockRecommendations = (timeframe: TimeFrame) => {
  const queryClient = useQueryClient();

  const transformToStockTicker = (recommendation: any): StockTicker => ({
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
    fundamentalMetrics: recommendation.fundamental_metrics,
    technicalSignals: recommendation.technical_signals,
    marketContext: recommendation.market_context,
    primaryDrivers: recommendation.primary_drivers || [],
    aiAnalysis: {
      potentialGrowth: recommendation[`${timeframe.split('-')[0]}_term_analysis`]?.potentialGrowth || 0,
      confidence: recommendation.confidence_metrics?.confidence || 75,
      reason: recommendation.explanation || 'No analysis available at this time',
      primaryDrivers: recommendation.primary_drivers || []
    }
  });

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', timeframe],
    queryFn: async () => {
      console.log('Fetching recommendations for timeframe:', timeframe);
      
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-stock-recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ timeframe }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        return data.recommendations?.map(rec => transformToStockTicker(rec)) || [];
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (error) {
    console.error('Error in useStockRecommendations:', error);
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch stock recommendations. Please try again later.",
      variant: "destructive",
    });
  }

  return { recommendations, isLoading, error };
};