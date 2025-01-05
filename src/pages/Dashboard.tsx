import React, { useState } from "react";
import { StockTicker } from "@/lib/types/stock";
import RecommendationTabs from "@/components/recommendations/RecommendationTabs";
import Sidebar from "@/components/Sidebar";
import { useStockRecommendations } from "@/hooks/useStockRecommendations";

type TimeFrame = "short-term" | "medium-term" | "long-term";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");
  const { recommendations, isLoading } = useStockRecommendations(activeTab);

  return (
    <div className="relative min-h-screen">
      {/* Main background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 -z-20" />
      
      {/* Accent gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-b from-transparent via-violet-400/20 to-transparent" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern opacity-5 -z-10" />
      
      {/* Enhanced accent gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-violet-400/5 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen z-10">
        <Sidebar />
        <div className="flex-1 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-medium mb-4">
                <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                  Powered by AI
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                Investment Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Make data-driven decisions with AI-powered insights
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/40 rounded-lg border border-violet-100 p-6 animate-fade-in shadow-xl">
              <RecommendationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                recommendations={recommendations}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;