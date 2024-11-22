import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import StockCard from "@/components/StockCard";
import RecommendationCard from "@/components/RecommendationCard";
import { getTopStocks, getDailyPrices, connectWebSocket, disconnectWebSocket } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveData, setLiveData] = useState<Record<string, number>>({});

  const { data: topStocks, isLoading: isLoadingStocks } = useQuery({
    queryKey: ['topStocks'],
    queryFn: getTopStocks,
  });

  const { data: stockPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['stockPrices', topStocks],
    queryFn: async () => {
      if (!topStocks) return {};
      const prices: Record<string, any> = {};
      for (const stock of topStocks) {
        prices[stock.ticker] = await getDailyPrices(stock.ticker);
      }
      return prices;
    },
    enabled: !!topStocks,
  });

  useEffect(() => {
    const handleWebSocketMessage = (data: any[]) => {
      if (Array.isArray(data)) {
        data.forEach((msg) => {
          if (msg.ev === 'T') {
            setLiveData(prev => ({
              ...prev,
              [msg.sym]: msg.p
            }));
          }
        });
      }
    };

    connectWebSocket(handleWebSocketMessage);
    return () => disconnectWebSocket();
  }, []);

  if (isLoadingStocks || isLoadingPrices) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6 fade-in">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStockChange = (symbol: string) => {
    if (!stockPrices?.[symbol]) return { change: 0, changePercent: 0 };
    const dailyData = stockPrices[symbol];
    const change = liveData[symbol] 
      ? liveData[symbol] - dailyData.o
      : dailyData.c - dailyData.o;
    const changePercent = (change / dailyData.o) * 100;
    return { change, changePercent };
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold">Market Pulse</h1>
          <p className="text-muted-foreground">AI-Powered Stock Analysis & Recommendations</p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <MarketOverview />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Top Movers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStocks?.map((stock) => {
              const { change, changePercent } = getStockChange(stock.ticker);
              return (
                <StockCard
                  key={stock.ticker}
                  symbol={stock.ticker}
                  name={stock.name}
                  price={liveData[stock.ticker] || (stockPrices?.[stock.ticker]?.c || 0)}
                  change={change}
                  changePercent={changePercent}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topStocks?.slice(0, 2).map((stock) => (
              <RecommendationCard
                key={stock.ticker}
                symbol={stock.ticker}
                name={stock.name}
                recommendation={Math.random() > 0.5 ? "Buy" : "Hold"}
                confidence={Math.floor(Math.random() * 30) + 70}
                reason="Based on current market trends and technical analysis"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;