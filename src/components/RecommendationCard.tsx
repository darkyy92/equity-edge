import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RecommendationHeader } from "./recommendations/card/RecommendationHeader";
import { PriceSection } from "./recommendations/card/PriceSection";
import { DriversSection } from "./recommendations/card/DriversSection";
import { GrowthSection } from "./recommendations/card/GrowthSection";

interface RecommendationCardProps {
  symbol: string;
  name: string;
  recommendation: "Buy" | "Sell" | "Hold";
  confidence: number;
  reason: string;
  price: number;
  change: number;
  changePercent: number;
  entryZone?: string;
  entryZoneExplanation?: string;
  volume: number;
  vwap: number;
  growthPotential: number;
  timeframe: string;
  isin?: string;
  valorNumber?: string;
  fundamentalMetrics?: {
    roe?: number;
    profitMargin?: number;
    revenueGrowth?: number;
  };
  technicalSignals?: {
    rsi?: number;
    macd?: string;
    movingAverages?: string;
  };
  marketContext?: {
    sectorTrend?: string;
    peerComparison?: string;
  };
  primaryDrivers?: string[];
}

/**
 * RecommendationCard Component
 * 
 * Displays detailed stock recommendation information in a card format.
 * 
 * Features:
 * - Shows buy/sell recommendation with confidence level
 * - Displays current price and price change
 * - Lists primary drivers affecting the stock
 * - Shows growth potential with timeframe context
 * - Links to detailed stock analysis page
 * 
 * @param props - See RecommendationCardProps interface for detailed prop documentation
 */
const RecommendationCard = ({
  symbol,
  name,
  recommendation,
  confidence,
  reason,
  price,
  changePercent,
  entryZone,
  entryZoneExplanation,
  growthPotential,
  timeframe,
  primaryDrivers = [],
}: RecommendationCardProps) => {
  return (
    <Link to={`/stock/${symbol}`}>
      <Card className="bg-background/95 backdrop-blur-lg border-border/30 p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-200">
        <RecommendationHeader
          recommendation={recommendation}
          confidence={confidence}
          name={name}
          symbol={symbol}
        />
        
        <PriceSection 
          price={price}
          entryZone={entryZone || "N/A"}
          entryZoneExplanation={entryZoneExplanation}
        />

        <DriversSection primaryDrivers={primaryDrivers} />

        <GrowthSection
          growthPotential={growthPotential}
          timeframe={timeframe}
          reason={reason}
        />
      </Card>
    </Link>
  );
};

export default RecommendationCard;