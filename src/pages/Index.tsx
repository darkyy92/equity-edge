import { useState } from "react";
import MarketOverview from "@/components/MarketOverview";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { getTopStocks } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("short-term");

  // Primary data fetch from Polygon.io
  const { data: stockData, isLoading: isLoadingStocks } = useQuery({
    queryKey: ['stockData'],
    queryFn: getTopStocks,
    staleTime: 15 * 60 * 1000, // Consider data fresh for 15 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });

  // Cache data in Supabase when we get new stock data
  const cacheStockData = async (stocks: any[]) => {
    if (!stocks?.length) return;

    const recommendations = stocks.map(stock => ({
      symbol: stock.ticker,
      short_term_analysis: {
        potentialGrowth: stock.changePercent || 0,
        confidence: 75,
        timeframe: "short",
      },
      medium_term_analysis: {
        potentialGrowth: stock.changePercent || 0,
        confidence: 70,
        timeframe: "medium",
      },
      long_term_analysis: {
        potentialGrowth: stock.changePercent || 0,
        confidence: 65,
        timeframe: "long",
      },
      explanation: `Based on ${stock.name}'s recent performance and market trends`,
    }));

    try {
      const { error } = await supabase
        .from('stock_recommendations')
        .upsert(
          recommendations.map(rec => ({
            symbol: rec.symbol,
            short_term_analysis: rec.short_term_analysis,
            medium_term_analysis: rec.medium_term_analysis,
            long_term_analysis: rec.long_term_analysis,
            explanation: rec.explanation,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'symbol' }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error caching stock data:', error);
      toast({
        title: "Warning",
        description: "Could not cache stock data, but live data is still available",
        variant: "destructive",
      });
    }
  };

  // Cache stock data whenever we get new data
  if (stockData && !isLoadingStocks) {
    cacheStockData(stockData);
  }

  const getAnalysisForTerm = (stock: any, term: string) => {
    // For live data from Polygon.io
    if (stock.ticker) {
      return {
        potentialGrowth: stock.changePercent || 0,
        confidence: 75,
        timeframe: term,
      };
    }

    // For cached data from Supabase
    switch (term) {
      case 'short-term':
        return stock.short_term_analysis;
      case 'medium-term':
        return stock.medium_term_analysis;
      case 'long-term':
        return stock.long_term_analysis;
      default:
        return null;
    }
  };

  if (isLoadingStocks) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <SearchBar />
        <MarketOverview />

        <div className="space-y-4">
          <Tabs defaultValue="short-term" className="w-full" onValueChange={setActiveTab}>
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
                    ? 'Stocks predicted to rise sharply in the next quarter'
                    : term === 'medium-term'
                    ? 'Stable stocks with moderate growth potential'
                    : 'Companies with robust fundamentals and growth strategies'}
                </p>

                {stockData && stockData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stockData.map((stock) => {
                      const analysis = getAnalysisForTerm(stock, term);
                      
                      if (!analysis) return null;
                      
                      return (
                        <RecommendationCard
                          key={stock.ticker}
                          symbol={stock.ticker}
                          name={stock.name}
                          recommendation={analysis.potentialGrowth >= 0 ? "Buy" : "Sell"}
                          confidence={analysis.confidence}
                          reason={`Based on recent market performance and ${term} analysis`}
                          price={stock.price || 0}
                          change={stock.change || 0}
                          changePercent={stock.changePercent || 0}
                          volume={stock.volume || 0}
                          vwap={stock.vwap || 0}
                        />
                      );
                    })}
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