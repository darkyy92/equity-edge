import React from "react";
import { StockWithAnalysis, TimeframeKey } from "@/lib/types/recommendations";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { EmptyRecommendations } from "./EmptyRecommendations";

interface RecommendationsGridProps {
  recommendations: StockWithAnalysis[] | undefined;
  isLoading: boolean;
  timeframe: string;
}

/**
 * RecommendationsGrid Component
 * 
 * Displays a grid of stock recommendations based on AI analysis for different timeframes.
 * 
 * Features:
 * - Shows loading skeletons while data is being fetched
 * - Displays empty state when no recommendations are available
 * - Renders recommendation cards with stock analysis data
 * - Handles different timeframes (short, medium, long term)
 * 
 * @param recommendations - Array of stock recommendations with AI analysis
 * @param isLoading - Loading state indicator
 * @param timeframe - Current selected timeframe
 */
const RecommendationsGrid: React.FC<RecommendationsGridProps> = ({
  recommendations,
  isLoading,
  timeframe
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (!recommendations || recommendations.length === 0) {
    return <EmptyRecommendations />;
  }

  /**
   * Extracts timeframe-specific analysis data from a stock recommendation
   */
  const getTimeframeData = (stock: StockWithAnalysis, key: string) => {
    const timeframeKey = `${key.split('-')[0]}_term_analysis` as keyof typeof stock;
    return stock[timeframeKey] as Record<string, any> | undefined;
  };

  /**
   * Gets the confidence value for a stock recommendation
   */
  const getConfidence = (stock: StockWithAnalysis): number => {
    const analysis = getTimeframeData(stock, timeframe);
    return analysis?.confidence_metrics?.confidence ?? 0;
  };

  /**
   * Gets the growth potential for a stock recommendation
   */
  const getGrowthPotential = (stock: StockWithAnalysis): number => {
    const analysis = getTimeframeData(stock, timeframe);
    return analysis?.potentialGrowth ?? 0;
  };

  /**
   * Gets the analysis reason for a stock recommendation
   */
  const getReason = (stock: StockWithAnalysis): string => {
    const analysis = getTimeframeData(stock, timeframe);
    return analysis?.reason ?? '';
  };

  /**
   * Gets the primary drivers for a stock recommendation
   */
  const getPrimaryDrivers = (stock: StockWithAnalysis): string[] => {
    const analysis = getTimeframeData(stock, timeframe);
    return analysis?.primary_drivers ?? [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((stock) => {
        const confidence = getConfidence(stock);
        
        // Skip recommendations without confidence data
        if (confidence === null || confidence === undefined) {
          console.warn(`No confidence data available for ${stock.symbol}`);
          return null;
        }

        return (
          <RecommendationCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            recommendation={getGrowthPotential(stock) >= 0 ? "Buy" : "Sell"}
            confidence={confidence}
            reason={getReason(stock)}
            price={stock.price ?? 0}
            change={stock.change ?? 0}
            changePercent={stock.changePercent ?? 0}
            volume={stock.volume ?? 0}
            vwap={stock.vwap ?? 0}
            growthPotential={getGrowthPotential(stock)}
            timeframe={timeframe.split('-')[0]}
            isin={stock.isin}
            valorNumber={stock.valor_number}
            fundamentalMetrics={stock.fundamentalMetrics}
            technicalSignals={stock.technicalSignals}
            marketContext={stock.marketContext}
            primaryDrivers={getPrimaryDrivers(stock)}
          />
        );
      })}
    </div>
  );
};

export default RecommendationsGrid;