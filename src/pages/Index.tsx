import React from "react";
import MarketOverview from "@/components/MarketOverview";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StockCardSkeleton from "@/components/StockCardSkeleton";
import RecommendationCard from "@/components/RecommendationCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StockTicker, FundamentalMetrics, TechnicalSignals, MarketContext } from "@/lib/types/stock";
import { Json } from "@/integrations/supabase/types";

type TimeFrame = "short-term" | "medium-term" | "long-term";

interface StockRecommendation {
  symbol: string;
  name?: string;
  confidence_metrics: {
    confidence: number;
  } | null;
  explanation: string | null;
  fundamental_metrics: Json | null;
  technical_signals: Json | null;
  market_context: Json | null;
  primary_drivers: string[] | null;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  vwap?: number;
  isin?: string;
  valor_number?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TimeFrame>("short-term");
  const queryClient = useQueryClient();

  const transformToStockTicker = (recommendation: StockRecommendation): StockTicker => ({
    ticker: recommendation.symbol,
    symbol: recommendation.symbol,
    name: recommendation.name || recommendation.symbol,
    market: 'US',
    locale: 'us',
    primary_exchange: 'NYSE',
    type: 'CS',
    active: true,
    currency_name: 'USD',
    cik: '',
    composite_figi: '',
    share_class_figi: '',
    last_updated_utc: new Date().toISOString(),
    price: recommendation.price,
    change: recommendation.change,
    changePercent: recommendation.changePercent,
    volume: recommendation.volume,
    vwap: recommendation.vwap,
    isin: recommendation.isin,
    valor_number: recommendation.valor_number,
    fundamentalMetrics: recommendation.fundamental_metrics as FundamentalMetrics | undefined,
    technicalSignals: recommendation.technical_signals as TechnicalSignals | undefined,
    marketContext: recommendation.market_context as MarketContext | undefined,
    primaryDrivers: recommendation.primary_drivers || [],
    aiRecommendation: {
      timeframe: activeTab.split('-')[0] as 'short' | 'medium' | 'long',
      potentialGrowth: 0,
      confidence: recommendation.confidence_metrics?.confidence ?? 75,
      explanation: recommendation.explanation || undefined
    }
  });

  const prefetchOtherTabs = async (currentTab: TimeFrame) => {
    const otherTabs: TimeFrame[] = ["short-term", "medium-term", "long-term"].filter(
      (tab) => tab !== currentTab
    ) as TimeFrame[];

    for (const tab of otherTabs) {
      await queryClient.prefetchQuery({
        queryKey: ['recommendations', tab],
        queryFn: () => fetchRecommendations(tab),
      });
    }
  };

  const fetchRecommendations = async (timeframe: string): Promise<StockTicker[]> => {
    const { data: cachedRecommendations, error: dbError } = await supabase
      .from('stock_recommendations')
      .select('*')
      .eq('strategy_type', timeframe.split('-')[0])
      .order('updated_at', { ascending: false })
      .limit(9);

    if (dbError) throw dbError;

    if (cachedRecommendations && cachedRecommendations.length > 0) {
      return cachedRecommendations.map(rec => transformToStockTicker(rec as unknown as StockRecommendation));
    }

    const response = await supabase.functions.invoke('get-stock-recommendations', {
      body: { timeframe: timeframe.split('-')[0] }
    });

    if (response.error) throw response.error;
    return (response.data.recommendations as StockRecommendation[]).map(transformToStockTicker);
  };

  const { data: recommendations, isLoading, error } = useQuery<StockTicker[]>({
    queryKey: ['recommendations', activeTab],
    queryFn: () => fetchRecommendations(activeTab),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: () => {
      const cachedData = queryClient.getQueryData(['recommendations', activeTab]) as StockTicker[] | undefined;
      return cachedData;
    },
  });

  useEffect(() => {
    prefetchOtherTabs(activeTab);
  }, [activeTab]);

  if (error) {
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch stock recommendations. Please try again later.",
      variant: "destructive",
    });
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
                  {getTimeframeDescription(term as TimeFrame)}
                </p>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <StockCardSkeleton key={i} />
                    ))}
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((stock) => (
                      <RecommendationCard
                        key={stock.symbol}
                        symbol={stock.symbol}
                        name={stock.name}
                        recommendation={stock.aiRecommendation?.potentialGrowth >= 0 ? "Buy" : "Sell"}
                        confidence={stock.aiRecommendation?.confidence ?? 75}
                        reason={stock.aiRecommendation?.explanation || `Based on ${stock.name}'s recent performance and market analysis`}
                        price={stock.price ?? 0}
                        change={stock.change ?? 0}
                        changePercent={stock.changePercent ?? 0}
                        volume={stock.volume ?? 0}
                        vwap={stock.vwap ?? 0}
                        growthPotential={stock.aiRecommendation?.potentialGrowth ?? 0}
                        timeframe={term.split('-')[0]}
                        isin={stock.isin}
                        valorNumber={stock.valor_number}
                        fundamentalMetrics={stock.fundamentalMetrics}
                        technicalSignals={stock.technicalSignals}
                        marketContext={stock.marketContext}
                        primaryDrivers={stock.primaryDrivers || []}
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
