import { Card } from "@/components/ui/card";
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
    <div className="stock-card-glow block rounded-lg relative"> {/* Remove overflow-hidden */}
      <Card className="bg-background/95 backdrop-blur-lg border-border/30 p-4 md:p-6 lg:p-8 transition-all duration-200 h-full"> {/* Add h-full to ensure card fills link */}
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
    </div>
  );
};

export default RecommendationCard;