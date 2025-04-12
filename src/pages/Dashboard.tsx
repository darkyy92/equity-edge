
import React, { useState } from "react";
import RecommendationTabs from "@/components/recommendations/RecommendationTabs";
import Sidebar from "@/components/Sidebar";
import { useStockRecommendations } from "@/hooks/useStockRecommendations";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";

type TimeFrame = "short-term" | "medium-term" | "long-term";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");
  const { recommendations, isLoading } = useStockRecommendations(activeTab);

  return (
    <div className="relative min-h-screen">
      {/* Main background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#1E1E3F] to-[#1B1B4B] -z-20" />
      
      {/* Accent gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern opacity-10 -z-10" />
      
      {/* Enhanced accent gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen z-10">
        <Sidebar />
        <div className="flex-1 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-medium mb-4">
                <span className="px-3 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10">
                  Powered by AI
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Investment Dashboard
              </h1>
              <p className="text-lg text-white/60 mb-8">
                Make data-driven decisions with AI-powered insights
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-black/20 rounded-lg border border-white/10 p-6 animate-fade-in shadow-xl">
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
