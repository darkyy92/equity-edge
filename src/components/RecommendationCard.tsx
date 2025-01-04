import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon, 
  BarChart3Icon, 
  NewspaperIcon,
  BuildingIcon,
  AlertCircleIcon,
  InfoIcon,
  StarIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface RecommendationCardProps {
  symbol: string;
  name: string;
  recommendation: "Buy" | "Sell" | "Hold";
  confidence: number;
  reason: string;
  price: number;
  change: number;
  changePercent: number;
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

const RecommendationCard = ({
  symbol,
  name,
  recommendation,
  confidence,
  reason,
  price,
  change,
  changePercent,
  volume,
  vwap,
  growthPotential,
  timeframe,
  isin,
  valorNumber,
  fundamentalMetrics,
  technicalSignals,
  marketContext,
  primaryDrivers = [],
}: RecommendationCardProps) => {
  const getBadgeColor = (rec: string) => {
    switch (rec) {
      case "Buy":
        return "bg-success/10 text-success hover:bg-success/20";
      case "Sell":
        return "bg-error/10 text-error hover:bg-error/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <Link to={`/stock/${symbol}`}>
      <Card className="bg-background/95 backdrop-blur-lg border-border/50 p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getBadgeColor(recommendation)}>{recommendation}</Badge>
              <Badge variant="outline" className="bg-[#C6B67E]/10 text-[#C6B67E] border-[#C6B67E]/20">
                {confidence}% Confidence
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-[#C6B67E]">
            <StarIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
            <p className="text-lg font-semibold">${price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Change</p>
            <p className={`text-lg font-semibold ${changePercent >= 0 ? 'text-success' : 'text-error'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {primaryDrivers.map((driver, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="mr-2 mb-2 bg-accent/50 text-foreground border-accent"
            >
              {driver}
            </Badge>
          ))}
        </div>

        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4 text-[#C6B67E]" />
              <span className="text-sm font-medium">Growth Potential</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className={`text-sm font-semibold ${growthPotential >= 0 ? 'text-success' : 'text-error'}`}>
                    {growthPotential >= 0 ? '+' : ''}{growthPotential}%
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated growth potential for {timeframe} term</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </Card>
    </Link>
  );
};

export default RecommendationCard;
