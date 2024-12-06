import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyPrices } from "@/lib/api";
import { getAIAnalysis } from "@/lib/openai";
import type { AIAnalysisResponse } from "@/lib/openai";
import { supabase } from "@/integrations/supabase/client";
import StockHeader from "@/components/stock/StockHeader";
import PriceChart from "@/components/stock/PriceChart";
import AIAnalysisCard from "@/components/stock/AIAnalysisCard";
import AdvancedAnalysis from "@/components/AdvancedAnalysis";
import ComprehensiveAnalysis from "@/components/ComprehensiveAnalysis";
import EntryRangeChart from "@/components/EntryRangeChart";
import HoldSellIndicator from "@/components/HoldSellIndicator";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

const StockAnalysis = () => {
  const { symbol } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>("1W");

  const { data: priceData, dataUpdatedAt } = useQuery({
    queryKey: ['stockPrice', symbol, timeRange],
    queryFn: () => getDailyPrices(symbol || '', timeRange),
    enabled: !!symbol,
    refetchInterval: 60000,
  });

  const { data: aiAnalysis, isLoading: isAILoading } = useQuery<AIAnalysisResponse | null>({
    queryKey: ['aiAnalysis', symbol],
    queryFn: () => getAIAnalysis(symbol || '', priceData),
    enabled: !!symbol && !!priceData,
    refetchInterval: 1800000,
    staleTime: 1800000,
  });

  const { data: recommendation } = useQuery({
    queryKey: ['stockRecommendation', symbol],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('symbol', symbol)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!symbol,
  });

  if (!symbol) return <div>Invalid stock symbol</div>;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <StockHeader 
          symbol={symbol} 
          priceData={priceData} 
          dataUpdatedAt={dataUpdatedAt}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <PriceChart
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            chartData={priceData?.chartData}
          />
          
          <div className="space-y-6">
            {recommendation?.entry_range && (
              <EntryRangeChart 
                data={priceData?.chartData || []}
                entryRange={recommendation.entry_range}
              />
            )}
            
            {recommendation?.hold_sell_recommendation && (
              <HoldSellIndicator
                recommendation={recommendation.hold_sell_recommendation}
                strength={recommendation.recommendation_strength || 'yellow'}
                explanation={recommendation.explanation || ''}
              />
            )}
          </div>
        </div>

        <AdvancedAnalysis 
          symbol={symbol} 
          historicalData={priceData?.chartData || []}
        />

        <ComprehensiveAnalysis symbol={symbol} />
        
        <AIAnalysisCard 
          aiAnalysis={aiAnalysis} 
          isLoading={isAILoading}
        />
      </div>
    </div>
  );
};

export default StockAnalysis;