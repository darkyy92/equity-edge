import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecommendationHeaderProps {
  recommendation: "Buy" | "Sell" | "Hold";
  symbol: string;
  name: string;
  confidence: number;
}

const getBadgeColor = (recommendation: string) => {
  switch (recommendation) {
    case "Buy": return "bg-success/10 text-success hover:bg-success/20 border-success/20";
    case "Sell": return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20";
    default: return "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary/20";
  }
};

export const RecommendationHeader = ({ recommendation, symbol, name, confidence }: RecommendationHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          {/* Removed the Recommendation Badge: <Badge className={getBadgeColor(recommendation)}>{recommendation}</Badge> */}
          <Badge className="bg-purple-900/30 text-purple-400 border-purple-800/50 text-sm px-2 py-1 rounded-full font-medium">
            {confidence}% Confidence
          </Badge>
        </div>
        <h3 className="text-2xl font-bold truncate" title={symbol}>
          {symbol}
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                className="text-sm text-gray-400 truncate"
              >
                {name}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-400">
        <StarIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};