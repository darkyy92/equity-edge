
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecommendationsGrid from "./RecommendationsGrid";
import { StockTicker } from "@/lib/types/stock";
import { TrendingUpIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  return (
    <Tabs defaultValue="short-term" className="w-full" onValueChange={(value) => setActiveTab(value as TimeFrame)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
              disabled={true}
            >
              Medium Term
            </TabsTrigger>
            <TabsTrigger 
              value="long-term"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              disabled={true}
            >
              Long Term
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="short-term" className="space-y-4">
        <p className="text-white/60">
          {getTimeframeDescription('short-term')}
        </p>
        <RecommendationsGrid
          recommendations={recommendations}
          isLoading={isLoading}
          timeframe="short-term"
        />
      </TabsContent>

      <TabsContent value="medium-term" className="space-y-4">
        <p className="text-white/60">
          {getTimeframeDescription('medium-term')}
        </p>
        <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <TrendingUpIcon className="mx-auto h-12 w-12 text-white/40 mb-4" />
          <p className="text-lg font-medium text-white">Medium-term recommendations coming soon</p>
          <p className="text-white/60">This feature is currently in development.</p>
        </Card>
      </TabsContent>

      <TabsContent value="long-term" className="space-y-4">
        <p className="text-white/60">
          {getTimeframeDescription('long-term')}
        </p>
        <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <TrendingUpIcon className="mx-auto h-12 w-12 text-white/40 mb-4" />
          <p className="text-lg font-medium text-white">Long-term recommendations coming soon</p>
          <p className="text-white/60">This feature is currently in development.</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;
