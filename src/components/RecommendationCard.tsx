import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon, 
  BarChart3Icon, 
  NewspaperIcon,
  BuildingIcon,
  AlertCircleIcon,
  InfoIcon
} from "lucide-react";
import { Link } from "react-router-dom";
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

  const getTimeframeText = (tf: string) => {
    switch(tf) {
      case 'short': return '3 months';
      case 'medium': return '6-12 months';
      case 'long': return '1+ years';
      default: return tf;
    }
  };

  return (
    <Link to={`/stock/${symbol}`}>
      <Card className="glass-card p-6 hover-scale hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getBadgeColor(recommendation)}>{recommendation}</Badge>
              <Badge variant="outline">{confidence}% Confidence</Badge>
            </div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
            {(isin || valorNumber) && (
              <div className="flex items-center gap-2 mt-1">
                <InfoIcon className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {isin && `ISIN: ${isin}`}
                  {isin && valorNumber && " | "}
                  {valorNumber && `Valor: ${valorNumber}`}
                </p>
              </div>
            )}
          </div>
          <TrendingUpIcon className="text-muted-foreground" />
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

        {/* Key Drivers Section */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Key Drivers</h4>
          <div className="flex flex-wrap gap-2">
            {primaryDrivers.map((driver, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {driver}
              </Badge>
            ))}
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="space-y-2 mb-4">
          {fundamentalMetrics && (
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                ROE: {fundamentalMetrics.roe}% | Margin: {fundamentalMetrics.profitMargin}%
              </span>
            </div>
          )}
          {technicalSignals && (
            <div className="flex items-center gap-2">
              <BarChart3Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                RSI: {technicalSignals.rsi} | {technicalSignals.movingAverages}
              </span>
            </div>
          )}
          {marketContext && (
            <div className="flex items-center gap-2">
              <NewspaperIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{marketContext.sectorTrend}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4 text-muted-foreground" />
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
                  <p>Estimated growth potential for {getTimeframeText(timeframe)} term</p>
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