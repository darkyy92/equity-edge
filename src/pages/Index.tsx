import { useState, useEffect } from "react";
import MarketOverview from "@/components/MarketOverview";
import StockCard from "@/components/StockCard";
import RecommendationCard from "@/components/RecommendationCard";
import { getTopStocks, getRecommendedStocks } from "@/lib/api";
import { StockTicker } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import { getAIAnalysis } from "@/lib/openai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("short-term");

  const { data: recommendations } = useQuery({
    queryKey: ['stockRecommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 300000, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold">Market Pulse</h1>
          <p className="text-muted-foreground">AI-Powered Stock Analysis & Recommendations</p>
        </div>

        <SearchBar />

        <MarketOverview />

        <div className="space-y-4">
          <Tabs defaultValue="short-term" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Investment Recommendations</h2>
              <TabsList>
                <TabsTrigger value="short-term">Short Term</TabsTrigger>
                <TabsTrigger value="medium-term">Medium Term</TabsTrigger>
                <TabsTrigger value="long-term">Long Term</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="short-term" className="space-y-4">
              <p className="text-muted-foreground">Stocks predicted to rise sharply in the next quarter</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations?.filter(rec => rec.short_term_analysis)?.map((stock) => (
                  <RecommendationCard
                    key={stock.id}
                    symbol={stock.symbol}
                    name={stock.symbol}
                    recommendation={stock.hold_sell_recommendation || "Hold"}
                    confidence={stock.short_term_analysis?.confidence || 70}
                    reason={stock.explanation || "Analysis not available"}
                    price={0}
                    change={0}
                    changePercent={0}
                    volume={0}
                    vwap={0}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="medium-term" className="space-y-4">
              <p className="text-muted-foreground">Stable stocks with moderate growth potential</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations?.filter(rec => rec.medium_term_analysis)?.map((stock) => (
                  <RecommendationCard
                    key={stock.id}
                    symbol={stock.symbol}
                    name={stock.symbol}
                    recommendation={stock.hold_sell_recommendation || "Hold"}
                    confidence={stock.medium_term_analysis?.confidence || 70}
                    reason={stock.explanation || "Analysis not available"}
                    price={0}
                    change={0}
                    changePercent={0}
                    volume={0}
                    vwap={0}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="long-term" className="space-y-4">
              <p className="text-muted-foreground">Companies with robust fundamentals and growth strategies</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations?.filter(rec => rec.long_term_analysis)?.map((stock) => (
                  <RecommendationCard
                    key={stock.id}
                    symbol={stock.symbol}
                    name={stock.symbol}
                    recommendation={stock.hold_sell_recommendation || "Hold"}
                    confidence={stock.long_term_analysis?.confidence || 70}
                    reason={stock.explanation || "Analysis not available"}
                    price={0}
                    change={0}
                    changePercent={0}
                    volume={0}
                    vwap={0}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;