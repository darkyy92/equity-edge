import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

interface RecommendationHeaderProps {
  recommendation: "Buy" | "Sell" | "Hold";
  confidence: number;
  name: string;
  symbol: string;
}

export const RecommendationHeader = ({
  recommendation,
  confidence,
  name,
  symbol,
}: RecommendationHeaderProps) => {
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
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={getBadgeColor(recommendation)}>{recommendation}</Badge>
          <Badge variant="outline" className="bg-[#C6B67E]/10 text-[#C6B67E] border-[#C6B67E]/20">
            {confidence}% Confidence
          </Badge>
        </div>
        <h3 className="text-lg font-semibold line-clamp-1" title={`${symbol} - ${name}`}>
          {symbol}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1" title={name}>
          {name}
        </p>
      </div>
      <Button variant="ghost" size="icon" className="text-[#C6B67E]">
        <StarIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};