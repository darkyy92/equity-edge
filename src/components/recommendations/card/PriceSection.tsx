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
        <p className="text-xl font-bold text-gray-100">${price.toFixed(2)}</p>
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
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsTooltipOpen(!isTooltipOpen);
                    }}
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Entry zone explanation</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="start"
                  className="max-w-xs p-4 text-sm bg-gray-800 text-gray-100 border border-gray-700 shadow-lg rounded-md z-50"
                  sideOffset={10}
                >
                  {entryZoneExplanation}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-lg font-semibold text-yellow-500">
          {entryZone || "N/A"}
        </p>
      </div>
    </div>
  );
};