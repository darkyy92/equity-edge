import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, DollarSignIcon, BarChart3Icon, ClockIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
          <div>
            <p className="text-sm text-muted-foreground mb-1">Volume</p>
            <p className="text-lg font-semibold">{formatNumber(volume)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">VWAP</p>
            <p className="text-lg font-semibold">${vwap.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUpIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Growth Potential</span>
            </div>
            <span className={`text-sm font-semibold ${growthPotential >= 0 ? 'text-success' : 'text-error'}`}>
              {growthPotential >= 0 ? '+' : ''}{growthPotential}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Range</span>
            </div>
            <span className="text-sm">{getTimeframeText(timeframe)}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">{reason}</p>
      </Card>
    </Link>
  );
};

export default RecommendationCard;