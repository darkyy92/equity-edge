import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "@/lib/types/stock";
import { MarketStackService } from "@/services/MarketStackService";

type TimeFrame = "short-term" | "medium-term" | "long-term";

export const useStockRecommendations = (timeframe: TimeFrame) => {
  const queryClient = useQueryClient();

  const transformToStockTicker = (recommendation: any, marketData: any = {}): StockTicker => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis`;
    
    // Get the company name from the recommendation data
    // First try to get it from the recommendation object directly
    let companyName = recommendation.name || recommendation.company_name;
    
    // If not found, try to get it from the timeframe analysis
    if (!companyName && recommendation[timeframeKey]?.company_name) {
      companyName = recommendation[timeframeKey].company_name;
    }
    
    // If still not found, use a fallback with the symbol
    if (!companyName) {
      console.warn(`No company name found for symbol ${recommendation.symbol}`);
      companyName = `${recommendation.symbol} Stock`;
    }
    
    // Find matching market data for this symbol
    const stockMarketData = marketData.find((data: any) => data.symbol === recommendation.symbol);
    
    return {
      ticker: recommendation.symbol,
      symbol: recommendation.symbol,
      name: companyName,
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
      // Use real market data if available, otherwise use defaults
      price: stockMarketData?.price || 0,
      change: stockMarketData?.change || 0,
      changePercent: stockMarketData?.changePercent || 0,
      volume: stockMarketData?.volume || 0,
      vwap: stockMarketData?.vwap || 0,
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
        // First, get the AI recommendations
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

        if (!functionResponse?.recommendations || functionResponse.recommendations.length === 0) {
          return [];
        }

        // Extract symbols from recommendations
        const symbols = functionResponse.recommendations.map((rec: any) => rec.symbol);

        // Fetch real-time market data for all symbols
        console.log('Fetching market data for symbols:', symbols);
        const marketData = await MarketStackService.getStockData(symbols);
        console.log('Received market data:', marketData);

        // Transform recommendations with real market data
        return functionResponse.recommendations.map((rec: any) => 
          transformToStockTicker(rec, marketData)
        );

      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
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