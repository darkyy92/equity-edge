import { AlertCircleIcon } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface GrowthSectionProps {
  growthPotential: number;
  timeframe: string;
  reason: string;
}

export const GrowthSection = ({ growthPotential, timeframe, reason }: GrowthSectionProps) => (
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
);