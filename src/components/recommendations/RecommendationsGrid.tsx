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
      <Card className="p-8 text-center bg-background/95 backdrop-blur-lg border-border/50">
        <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No recommendations available</p>
        <p className="text-muted-foreground">Check back later for updated analysis!</p>
      </Card>
    );
  }

  const getConfidence = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const timeframeKey = `${timeframe.split('-')[0]}_term_analysis` as keyof typeof stock;
    const analysis = stock[timeframeKey] as any;
    
    if (analysis?.confidence_metrics?.confidence) {
      return analysis.confidence_metrics.confidence;
    }
    
    return stock.aiAnalysis?.confidence || 0;
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

    return stock.aiAnalysis?.reason || '';
  };

  const getPrimaryDrivers = (stock: StockTicker & { aiAnalysis?: TimeframeAnalysis }) => {
    const stockWithDrivers = stock as any;
    if (Array.isArray(stockWithDrivers.primaryDrivers) && stockWithDrivers.primaryDrivers.length > 0) {
      return stockWithDrivers.primaryDrivers;
    }
    
    return stock.aiAnalysis?.primaryDrivers || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((stock) => {
        const confidence = getConfidence(stock);
        const growthPotential = getGrowthPotential(stock);
        const reason = getReason(stock);
        const primaryDrivers = getPrimaryDrivers(stock);

        // Only show recommendations with valid confidence values
        if (confidence === null || confidence === undefined) {
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