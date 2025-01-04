import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "@/lib/types/stock";

type TimeFrame = "short-term" | "medium-term" | "long-term";

export const useStockRecommendations = (timeframe: TimeFrame) => {
  const queryClient = useQueryClient();

  const transformToStockTicker = (recommendation: any): StockTicker => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis`;
    
    // Ensure we use the full company name from the recommendation data
    const fullName = recommendation.name || recommendation.company_name || recommendation.symbol;
    
    return {
      ticker: recommendation.symbol,
      symbol: recommendation.symbol,
      name: fullName, // Use the full company name
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
      fundamentalMetrics: recommendation.fundamental_metrics || null,
      technicalSignals: recommendation.technical_signals || null,
      marketContext: recommendation.market_context || null,
      primaryDrivers: recommendation.primary_drivers || [],
      aiAnalysis: {
        potentialGrowth: recommendation[timeframeKey]?.potentialGrowth || 0,
        confidence: recommendation.confidence_metrics?.confidence || 0,
        reason: recommendation.explanation || '',
        primaryDrivers: recommendation.primary_drivers || []
      }
    };
  };

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', timeframe],
    queryFn: async () => {
      console.log('Fetching recommendations for timeframe:', timeframe);
      
      try {
        const { data: { data: functionResponse }, error: functionError } = await supabase.functions.invoke(
          'get-stock-recommendations',
          {
            body: JSON.stringify({ timeframe }),
          }
        );

        if (functionError) {
          console.error('Error calling edge function:', functionError);
          throw functionError;
        }

        return functionResponse?.recommendations?.map(rec => transformToStockTicker(rec)) || [];
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