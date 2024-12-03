import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { StockTicker } from "@/lib/types/stock";

interface RecommendationsGridProps {
  recommendations: StockTicker[] | undefined;
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
        {[1, 2, 3].map((i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No recommendations available</p>
        <p className="text-muted-foreground">Check back later for updated analysis!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((stock) => {
        // Get the correct timeframe analysis based on current tab
        const timeframeKey = `${timeframe.split('-')[0]}_term_analysis`;
        const analysis = stock[timeframeKey as keyof StockTicker] as any;
        
        // Extract growth potential from the correct timeframe analysis
        const growthPotential = analysis?.potentialGrowth ?? 0;

        return (
          <RecommendationCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            recommendation={growthPotential >= 0 ? "Buy" : "Sell"}
            confidence={stock.aiRecommendation?.confidence ?? 75}
            reason={stock.aiRecommendation?.explanation || `Based on ${stock.name}'s recent performance and market analysis`}
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
            primaryDrivers={stock.primaryDrivers || []}
          />
        );
      })}
    </div>
  );
};

export default RecommendationsGrid;