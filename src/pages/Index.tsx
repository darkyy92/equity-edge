import { useState } from "react";
import MarketOverview from "@/components/MarketOverview";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StockCardSkeleton from "@/components/StockCardSkeleton";

const Index = () => {
  const [activeTab, setActiveTab] = useState("short-term");

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['stockRecommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
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

  const RecommendationCard = ({ stock, term }: { stock: any; term: string }) => {
    const analysis = getAnalysisForTerm(stock, term);
    const performance = analysis?.potentialGrowth || 0;
    const isPositive = performance >= 0;
    const confidence = analysis?.confidence || 70;

    return (
      <Link to={`/stock/${stock.symbol}`} className="block">
        <Card className="glass-card p-6 hover-scale transition-all duration-200 animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}>
                  {isPositive ? 'Buy' : 'Sell'}
                </span>
                <span className="text-sm text-muted-foreground">{confidence}% Confidence</span>
              </div>
              <h3 className="text-lg font-semibold">{stock.symbol}</h3>
            </div>
            {isPositive ? (
              <ArrowUpIcon className="text-success" />
            ) : (
              <ArrowDownIcon className="text-error" />
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Predicted Performance</p>
                <p className={`text-lg font-semibold ${isPositive ? 'text-success' : 'text-error'}`}>
                  {isPositive ? '+' : ''}{performance.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Strategy</p>
                <p className="text-lg font-semibold capitalize">{term.replace('-', ' ')}</p>
              </div>
            </div>

            <Button className="w-full group" variant="outline">
              View Analysis
              <ChevronRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </Link>
    );
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
                ) : recommendations && recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations
                      .filter(stock => getAnalysisForTerm(stock, term))
                      .map((stock) => (
                        <RecommendationCard key={stock.id} stock={stock} term={term} />
                      ))}
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