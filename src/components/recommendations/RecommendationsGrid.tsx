
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((stock) => {
        const confidence = stock.aiAnalysis?.confidence ?? 0;
        const growthPotential = stock.aiAnalysis?.potentialGrowth ?? 0;
        const reason = stock.aiAnalysis?.reason ?? '';
        const primaryDrivers = stock.primaryDrivers || [];

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
