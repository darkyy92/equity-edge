import React, { useState, useEffect } from "react";
import RecommendationTabs from "@/components/recommendations/RecommendationTabs";
import Sidebar from "@/components/Sidebar";
import { useStockRecommendations } from "@/hooks/useStockRecommendations";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StockTicker } from "@/lib/types/stock";

type TimeFrame = "short-term" | "medium-term" | "long-term";

const FALLBACK_DATA: StockTicker[] = [
  {
    ticker: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    market: "US",
    locale: "us",
    primary_exchange: "NASDAQ",
    type: "CS",
    active: true,
    currency_name: "USD",
    cik: "",
    composite_figi: "",
    share_class_figi: "",
    last_updated_utc: new Date().toISOString(),
    price: 173.31,
    change: 0.94,
    changePercent: 0.55,
    primaryDrivers: ["AI Integration", "Services Growth", "New Product Cycle"],
    aiAnalysis: {
      potentialGrowth: 12.5,
      confidence: 8,
      reason: "Strong ecosystem and services growth momentum",
      primaryDrivers: ["AI Integration", "Services Growth", "New Product Cycle"]
    }
  },
  {
    ticker: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    market: "US",
    locale: "us",
    primary_exchange: "NASDAQ",
    type: "CS",
    active: true,
    currency_name: "USD",
    cik: "",
    composite_figi: "",
    share_class_figi: "",
    last_updated_utc: new Date().toISOString(),
    price: 412.78,
    change: 2.14,
    changePercent: 0.52,
    primaryDrivers: ["Azure Cloud Growth", "AI Leadership", "Enterprise Adoption"],
    aiAnalysis: {
      potentialGrowth: 15.2,
      confidence: 9,
      reason: "Leading position in cloud services and enterprise AI",
      primaryDrivers: ["Azure Cloud Growth", "AI Leadership", "Enterprise Adoption"]
    }
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");
  const { recommendations, isLoading } = useStockRecommendations(activeTab);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!isLoading && (!recommendations || recommendations.length === 0)) {
      console.log("No recommendations found, enabling fallback data");
      setUseFallback(true);
      
      toast({
        title: "Using demo data",
        description: "No recommendations found in the database, showing sample data instead.",
      });
    }
  }, [isLoading, recommendations]);

  useEffect(() => {
    async function seedDatabaseIfEmpty() {
      try {
        const { count, error } = await supabase
          .from('stock_recommendations')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count === 0) {
          console.log("Database is empty, seeding with sample data");
        }
      } catch (e) {
        console.error("Error checking database:", e);
      }
    }
    
    seedDatabaseIfEmpty();
  }, []);

  const displayRecommendations = useFallback ? FALLBACK_DATA : recommendations;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#1E1E3F] to-[#1B1B4B] -z-20" />
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>
      
      <div className="fixed inset-0 grid-pattern opacity-10 -z-10" />
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

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
                recommendations={displayRecommendations}
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
