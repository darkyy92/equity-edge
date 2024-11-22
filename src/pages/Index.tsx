import { useState, useEffect } from "react";
import MarketOverview from "@/components/MarketOverview";
import StockCard from "@/components/StockCard";
import RecommendationCard from "@/components/RecommendationCard";
import { getTopStocks, getRecommendedStocks, connectWebSocket, disconnectWebSocket } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import { getAIAnalysis } from "@/lib/openai";

const Index = () => {
  const [liveData, setLiveData] = useState<Record<string, number>>({});

  const { data: topStocks } = useQuery({
    queryKey: ['topStocks'],
    queryFn: getTopStocks,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: recommendedStocks } = useQuery({
    queryKey: ['recommendedStocks'],
    queryFn: getRecommendedStocks,
    refetchInterval: 1800000, // Refetch every 30 minutes
  });

  const { data: aiReasons } = useQuery({
    queryKey: ['aiReasons', recommendedStocks],
    queryFn: async () => {
      if (!recommendedStocks) return {};
      const reasons: Record<string, string> = {};
      for (const stock of recommendedStocks) {
        const analysis = await getAIAnalysis(stock.ticker, stock);
        reasons[stock.ticker] = analysis.strategy;
      }
      return reasons;
    },
    enabled: !!recommendedStocks,
    refetchInterval: 1800000, // Refetch every 30 minutes
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

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold">Market Pulse</h1>
          <p className="text-muted-foreground">AI-Powered Stock Analysis & Recommendations</p>
        </div>

        <SearchBar />

        <MarketOverview />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Top Movers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStocks?.map((stock) => (
              <StockCard
                key={stock.ticker}
                symbol={stock.ticker}
                name={stock.name}
                price={liveData[stock.ticker] || stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedStocks?.map((stock) => (
              <RecommendationCard
                key={stock.ticker}
                symbol={stock.ticker}
                name={stock.name}
                recommendation={stock.changePercent >= 0 ? "Buy" : "Hold"}
                confidence={Math.floor(Math.random() * 30) + 70}
                reason={aiReasons?.[stock.ticker] || "Analyzing market data..."}
                price={liveData[stock.ticker] || stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                volume={stock.volume}
                vwap={stock.vwap}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;