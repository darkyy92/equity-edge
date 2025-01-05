import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecommendationsGrid from "./RecommendationsGrid";
import { StockTicker } from "@/lib/types/stock";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type TimeFrame = "short-term" | "medium-term" | "long-term";

interface RecommendationTabsProps {
  activeTab: TimeFrame;
  setActiveTab: (value: TimeFrame) => void;
  recommendations: StockTicker[] | undefined;
  isLoading: boolean;
}

const getTimeframeDescription = (timeframe: TimeFrame) => {
  switch (timeframe) {
    case 'short-term':
      return 'Stocks predicted to rise sharply in the next 3 months based on technical signals and momentum';
    case 'medium-term':
      return 'Stable stocks with solid fundamentals and moderate growth potential over 6-12 months';
    case 'long-term':
      return 'Companies with robust fundamentals, competitive advantages, and sustainable growth strategies (1+ years)';
  }
};

const RecommendationTabs: React.FC<RecommendationTabsProps> = ({
  activeTab,
  setActiveTab,
  recommendations,
  isLoading
}) => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    const toastId = toast({
      title: "Refreshing data",
      description: "Fetching fresh stock and AI recommendations...",
    });

    try {
      await queryClient.invalidateQueries({ 
        queryKey: ['recommendations'],
        refetchType: 'active',
      });
      
      await queryClient.refetchQueries({ 
        queryKey: ['recommendations'],
        type: 'active',
      });

      toast({
        title: "Data refreshed",
        description: "Successfully updated stock recommendations with fresh data.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh recommendations. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="short-term" className="w-full" onValueChange={(value) => setActiveTab(value as TimeFrame)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 bg-black/20 border-white/10 text-white hover:bg-white/10 transition-colors"
            disabled={isLoading}
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger 
              value="short-term"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
            >
              Short Term
            </TabsTrigger>
            <TabsTrigger 
              value="medium-term"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
            >
              Medium Term
            </TabsTrigger>
            <TabsTrigger 
              value="long-term"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
            >
              Long Term
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {['short-term', 'medium-term', 'long-term'].map((term) => (
        <TabsContent key={term} value={term} className="space-y-4">
          <p className="text-white/60">
            {getTimeframeDescription(term as TimeFrame)}
          </p>
          <RecommendationsGrid
            recommendations={recommendations}
            isLoading={isLoading}
            timeframe={term}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RecommendationTabs;