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

const Index = () => {
  const [activeTab, setActiveTab] = useState("short-term");

  // Fetch recommendations from Supabase
  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['stockRecommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch real-time stock data from Polygon
  const { data: stockData, isLoading: isLoadingStocks } = useQuery({
    queryKey: ['stockData'],
    queryFn: getTopStocks,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const getAnalysisForTerm = (stock: any, term: string) => {
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

  const getFilteredRecommendations = () => {
    if (!recommendations) return [];
    
    const filtered = recommendations.filter(stock => {
      const analysis = getAnalysisForTerm(stock, activeTab);
      return analysis && analysis.potentialGrowth !== undefined;
    });

    // If no recommendations in database, use Polygon data
    if (filtered.length === 0 && stockData) {
      return stockData.map(stock => ({
        id: stock.ticker,
        symbol: stock.ticker,
        [`${activeTab}_analysis`]: {
          potentialGrowth: stock.changePercent || 0,
          confidence: 75,
          explanation: `Based on ${stock.name}'s recent performance`,
        }
      }));
    }

    return filtered;
  };

  const filteredRecommendations = getFilteredRecommendations();
  const isLoading = isLoadingRecommendations || isLoadingStocks;

  // Find matching stock data for a recommendation
  const getStockData = (symbol: string) => {
    return stockData?.find(s => s.ticker === symbol) || null;
  };

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

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <StockCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecommendations.map((stock) => {
                      const analysis = getAnalysisForTerm(stock, term);
                      const realTimeData = getStockData(stock.symbol);
                      
                      return (
                        <RecommendationCard
                          key={stock.id}
                          symbol={stock.symbol}
                          name={realTimeData?.name || stock.symbol}
                          recommendation={analysis.potentialGrowth >= 0 ? "Buy" : "Sell"}
                          confidence={analysis.confidence || 70}
                          reason={analysis.explanation || "Based on AI analysis"}
                          price={realTimeData?.price || 0}
                          change={realTimeData?.change || 0}
                          changePercent={analysis.potentialGrowth}
                          volume={realTimeData?.volume || 0}
                          vwap={realTimeData?.vwap || 0}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No recommendations available for this time frame</p>
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