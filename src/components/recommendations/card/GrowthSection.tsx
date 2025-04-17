import { useState } from "react";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GrowthSectionProps {
  growthPotential: number;
  timeframe: string;
  reason: string;
}

const REASON_CHAR_LIMIT = 150;

export const GrowthSection = ({ growthPotential, timeframe, reason }: GrowthSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showReadMoreButton = reason.length > REASON_CHAR_LIMIT;

  // Map growth potential percentage to a 0-100 scale for the progress bar
  // Assuming a range of -50% to +50% for mapping purposes, adjust as needed
  const progressValue = Math.max(0, Math.min(100, (growthPotential + 50) * 1)); // Scale -50 to 0, 0 to 50, 50 to 100

  return (
    <div className="border-t border-border/50 pt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {growthPotential >= 0 ? (
            <TrendingUpIcon className="w-4 h-4 text-success" />
          ) : (
            <TrendingDownIcon className="w-4 h-4 text-destructive" />
          )}
          <span className="text-sm font-medium">Growth Potential ({timeframe})</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className={`text-sm font-semibold ${growthPotential >= 0 ? 'text-success' : 'text-destructive'}`}>
                {growthPotential >= 0 ? '+' : ''}{growthPotential}%
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Estimated growth potential for {timeframe} term</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={progressValue} className={`w-full h-1.5 mb-3 rounded-full ${growthPotential >= 0 ? '[&>*]:bg-success' : '[&>*]:bg-destructive]'}`} />
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
          className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300 hover:underline mt-1"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
};