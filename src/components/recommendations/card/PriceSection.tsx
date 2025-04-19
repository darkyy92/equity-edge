import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Import cn utility
import useIsMobile from "@/hooks/useIsMobile";

interface PriceSectionProps {
  price: number;
  entryZone: string;
  entryZoneExplanation?: string;
}

export const PriceSection = ({ price, entryZone, entryZoneExplanation }: PriceSectionProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleEntryZoneClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsTooltipOpen(!isTooltipOpen);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Current Price</p>
        <p className="text-xl font-bold text-gray-100">${price.toFixed(2)}</p>
      </div>
      <div
        className={cn(
          "rounded-md p-2 cursor-pointer transition-colors duration-200", // Increased padding
          isMobile && "border border-gray-700/50 bg-gray-800/30" // Apply subtle border and background on mobile
        )}
        onClick={handleEntryZoneClick} // Moved click handler here
        role="button" // Moved role here
        tabIndex={0} // Moved tabIndex here
      >
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
                  {/* Removed onClick from button, parent div handles click */}
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Entry zone explanation</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom" // Changed side to bottom
                  align="center" // Changed align to center
                  className="w-auto p-4 text-sm bg-gray-800 text-gray-100 border border-gray-700 shadow-lg rounded-md z-50 whitespace-normal" // Removed max-w-xs
                  sideOffset={10}
                >
                  {entryZoneExplanation}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p
          className="text-lg font-semibold text-yellow-500"
          // Removed onClick from p tag, parent div handles click
        >
          {entryZone || "N/A"}
        </p>
      </div>
    </div>
  );
};