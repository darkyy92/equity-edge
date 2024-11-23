import { useState } from "react";
import MarketOverview from "@/components/MarketOverview";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { getTopStocks } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "@/lib/types";

type TimeFrame = "short-term" | "medium-term" | "long-term";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");

  const { data: stockData, isLoading: isLoadingStocks, error } = useQuery({
    queryKey: ['stockData', activeTab],
    queryFn: () => getTopStocks(activeTab.split('-')[0] as 'short' | 'medium' | 'long'),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  if (error) {
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch stock recommendations. Please try again later.",
      variant: "destructive",
    });
  }

  if (isLoadingStocks) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <SearchBar />
          <MarketOverview />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <SearchBar />
        <MarketOverview />

        <div className="space-y-4">
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
                  {term === 'short-term' 
                    ? 'Stocks predicted to rise sharply in the next 3 months'
                    : term === 'medium-term'
                    ? 'Stable stocks with moderate growth potential over 6-12 months'
                    : 'Companies with robust fundamentals and long-term growth strategies (1+ years)'}
                </p>

                {stockData && stockData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stockData.map((stock) => (
                      <RecommendationCard
                        key={stock.ticker}
                        symbol={stock.ticker}
                        name={stock.name}
                        recommendation={stock.aiRecommendation?.potentialGrowth >= 0 ? "Buy" : "Sell"}
                        confidence={stock.aiRecommendation?.confidence ?? 75}
                        reason={`Based on ${stock.name}'s recent performance and market analysis for ${term.split('-')[0]} term growth`}
                        price={stock.price ?? 0}
                        change={stock.change ?? 0}
                        changePercent={stock.changePercent ?? 0}
                        volume={stock.volume ?? 0}
                        vwap={stock.vwap ?? 0}
                        growthPotential={stock.aiRecommendation?.potentialGrowth ?? 0}
                        timeframe={term.split('-')[0]}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No recommendations available</p>
                    <p className="text-muted-foreground">Check back later for updated analysis!</p>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;