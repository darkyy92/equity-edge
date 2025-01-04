import React, { useState } from "react";
import { StockTicker } from "@/lib/types/stock";
import RecommendationTabs from "@/components/recommendations/RecommendationTabs";
import Sidebar from "@/components/Sidebar";
import { useStockRecommendations } from "@/hooks/useStockRecommendations";

/**
 * Index Page Component
 * 
 * This component serves as the main dashboard page of the application.
 * It displays recommendations organized by timeframe with a sidebar for navigation.
 * 
 * Features:
 * - Tabbed view of stock recommendations (short, medium, long term)
 * - Sidebar navigation with integrated search
 * - Responsive layout
 */
type TimeFrame = "short-term" | "medium-term" | "long-term";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");
  const { recommendations, isLoading } = useStockRecommendations(activeTab);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold mb-6">Investment Dashboard</h1>
          <RecommendationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recommendations={recommendations}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;