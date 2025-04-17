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
          <Badge variant="outline" className="bg-[#C6B67E]/10 text-[#C6B67E] border-[#C6B67E]/20">
            {confidence}% Confidence
          </Badge>
        </div>
        <h3 className="text-lg font-semibold truncate" title={symbol}>
          {symbol}
        </h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p 
                className="text-sm text-muted-foreground truncate"
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
      <Button variant="ghost" size="icon" className="text-[#C6B67E]">
        <StarIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};