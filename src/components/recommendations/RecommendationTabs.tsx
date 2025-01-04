import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import RecommendationsGrid from "./RecommendationsGrid";
import { toast } from "@/components/ui/use-toast";

type TimeFrame = "short-term" | "medium-term" | "long-term";

interface RecommendationTabsProps {
  activeTab: TimeFrame;
  setActiveTab: (tab: TimeFrame) => void;
  recommendations: any[];
  isLoading: boolean;
}

const RecommendationTabs = ({
  activeTab,
  setActiveTab,
  recommendations,
  isLoading,
}: RecommendationTabsProps) => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    try {
      toast({
        title: "Refreshing recommendations",
        description: "Getting fresh AI analysis for your stocks...",
      });

      // Invalidate the cache for the current timeframe
      await queryClient.invalidateQueries({
        queryKey: ['recommendations', activeTab],
        refetchType: 'active',
        exact: true
      });

      toast({
        title: "Recommendations refreshed",
        description: "Your stock recommendations have been updated.",
      });
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast({
        title: "Refresh failed",
        description: "Unable to refresh recommendations. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="short-term">Short Term</TabsTrigger>
          <TabsTrigger value="medium-term">Medium Term</TabsTrigger>
          <TabsTrigger value="long-term">Long Term</TabsTrigger>
        </TabsList>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="ml-4"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <TabsContent value="short-term" className="mt-0">
        <RecommendationsGrid
          recommendations={recommendations}
          isLoading={isLoading}
          timeframe="short-term"
        />
      </TabsContent>
      <TabsContent value="medium-term" className="mt-0">
        <RecommendationsGrid
          recommendations={recommendations}
          isLoading={isLoading}
          timeframe="medium-term"
        />
      </TabsContent>
      <TabsContent value="long-term" className="mt-0">
        <RecommendationsGrid
          recommendations={recommendations}
          isLoading={isLoading}
          timeframe="long-term"
        />
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;