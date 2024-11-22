import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon } from "lucide-react";

interface RecommendationCardProps {
  symbol: string;
  name: string;
  recommendation: "Buy" | "Sell" | "Hold";
  confidence: number;
  reason: string;
}

const RecommendationCard = ({
  symbol,
  name,
  recommendation,
  confidence,
  reason,
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

  return (
    <Card className="glass-card p-6 hover-scale">
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
      <p className="text-sm text-muted-foreground">{reason}</p>
    </Card>
  );
};

export default RecommendationCard;