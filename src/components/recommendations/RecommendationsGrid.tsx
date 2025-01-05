import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { StockTicker } from "@/lib/types/stock";

interface TimeframeAnalysis {
  potentialGrowth: number;
  reason: string;
  confidence: number;
  primaryDrivers: string[];
}

interface RecommendationsGridProps {
  recommendations: (StockTicker & { aiAnalysis?: TimeframeAnalysis })[] | undefined;
  isLoading: boolean;
  timeframe: string;
}

const RecommendationsGrid: React.FC<RecommendationsGridProps> = ({
  recommendations,
  isLoading,
  timeframe
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border-white/10">
        <TrendingUpIcon className="mx-auto h-12 w-12 text-white/40 mb-4" />
        <p className="text-lg font-medium text-white">No recommendations available</p>
        <p className="text-white/60">Check back later for updated analysis!</p>
      </Card>
    );
  }

  const getConfidence = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis` as keyof typeof stock;
    const analysis = stock[timeframeKey] as any;
    
    if (analysis?.confidence) {
      return analysis.confidence;
    }
    
    if (stock.confidence_metrics?.confidence) {
      return stock.confidence_metrics.confidence;
    }
    
    return stock.aiAnalysis?.confidence || 75;
  };

  const getGrowthPotential = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis` as keyof typeof stock;
    const analysis = stock[timeframeKey] as any;
    
    if (analysis?.potentialGrowth) {
      return analysis.potentialGrowth;
    }
    
    return stock.aiAnalysis?.potentialGrowth || 0;
  };

  const getReason = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis` as keyof typeof stock;
    const analysis = stock[timeframeKey] as any;
    
    if (analysis?.reason) {
      return analysis.reason;
    }

    return stock.aiAnalysis?.reason || 'Analysis in progress...';
  };

  const getPrimaryDrivers = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis` as keyof typeof stock;
    const analysis = stock[timeframeKey] as any;
    
    // First try to get from timeframe-specific analysis
    if (analysis?.primaryDrivers && analysis.primaryDrivers.length > 0) {
      return analysis.primaryDrivers;
    }
    
    // Then try to get from primary_drivers array
    if (Array.isArray(stock.primary_drivers) && stock.primary_drivers.length > 0) {
      return stock.primary_drivers;
    }
    
    // Finally try to get from aiAnalysis
    if (stock.aiAnalysis?.primaryDrivers && stock.aiAnalysis.primaryDrivers.length > 0) {
      return stock.aiAnalysis.primaryDrivers;
    }
    
    // Return empty array if no drivers found
    return [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((stock) => {
        const confidence = getConfidence(stock);
        const growthPotential = getGrowthPotential(stock);
        const reason = getReason(stock);
        const primaryDrivers = getPrimaryDrivers(stock);

        if (!confidence) {
          console.warn(`No confidence data available for ${stock.symbol}`);
          return null;
        }

        return (
          <RecommendationCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            recommendation={growthPotential >= 0 ? "Buy" : "Sell"}
            confidence={confidence}
            reason={reason}
            price={stock.price ?? 0}
            change={stock.change ?? 0}
            changePercent={stock.changePercent ?? 0}
            volume={stock.volume ?? 0}
            vwap={stock.vwap ?? 0}
            growthPotential={growthPotential}
            timeframe={timeframe.split('-')[0]}
            isin={stock.isin}
            valorNumber={stock.valor_number}
            fundamentalMetrics={stock.fundamentalMetrics}
            technicalSignals={stock.technicalSignals}
            marketContext={stock.marketContext}
            primaryDrivers={primaryDrivers}
          />
        );
      })}
    </div>
  );
};

export default RecommendationsGrid;
