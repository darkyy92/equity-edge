import { useState } from "react";
import { TrendingUpIcon } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface GrowthSectionProps {
  growthPotential: number;
  timeframe: string;
  reason: string;
}

const REASON_CHAR_LIMIT = 150;

export const GrowthSection = ({ growthPotential, timeframe, reason }: GrowthSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showReadMoreButton = reason.length > REASON_CHAR_LIMIT;

  return (
    <div className="border-t border-border/50 pt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="w-4 h-4 text-[#C6B67E]" />
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
      <p 
        className={`text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}
      >
        {reason}
      </p>
      {showReadMoreButton && (
        <Button 
          variant="link" 
          onClick={(e) => {
            e.preventDefault(); 
            setIsExpanded(!isExpanded);
          }}
          className="h-auto p-0 text-xs text-primary hover:underline mt-1"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
};