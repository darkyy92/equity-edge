import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecommendationsGrid from "./RecommendationsGrid";
import { StockTicker } from "@/lib/types/stock";

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Investment Recommendations</h2>
        <TabsList>
          <TabsTrigger value="short-term">Short Term</TabsTrigger>
          <TabsTrigger value="medium-term">Medium Term</TabsTrigger>
          <TabsTrigger value="long-term">Long Term</TabsTrigger>
        </TabsList>
      </div>

      {['short-term', 'medium-term', 'long-term'].map((term) => (
        <TabsContent key={term} value={term} className="space-y-4">
          <p className="text-muted-foreground">
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