import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";

interface PriceSectionProps {
  price: number;
  entryZone: string;
  entryZoneExplanation?: string;
}

export const PriceSection = ({ price, entryZone, entryZoneExplanation }: PriceSectionProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Current Price</p>
        <p className="text-lg font-semibold">${price.toFixed(2)}</p>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-sm text-muted-foreground">Entry Zone</p>
          {entryZoneExplanation && (
            <TooltipProvider>
              <Tooltip 
                delayDuration={200} 
                open={isTooltipOpen}
                onOpenChange={setIsTooltipOpen}
              >
                <TooltipTrigger asChild>
                  <button 
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsTooltipOpen(!isTooltipOpen);
                    }}
                  >
                    <Info className="h-3 w-3" />
                    <span className="sr-only">Entry zone explanation</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  align="start" 
                  className="max-w-[220px] p-3 text-sm bg-card border-border shadow-md rounded-md z-50"
                  sideOffset={5}
                >
                  {entryZoneExplanation}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-lg font-semibold text-primary">
          {entryZone || "N/A"}
        </p>
      </div>
    </div>
  );
};