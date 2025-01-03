import { Card } from "@/components/ui/card";
import { ChartLineIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MarketStackService } from "@/services/MarketStackService";

const MarketOverview = () => {
  const indices = {
    "SPY": "S&P 500",
    "QQQ": "NASDAQ",
    "DIA": "DOW JONES"
  };

  const { data: prices } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: async () => {
      const data: Record<string, any> = {};
      for (const symbol of Object.keys(indices)) {
        const stockData = await MarketStackService.getDailyPrices(symbol, 1);
        data[symbol] = stockData[0];
      }
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const getChangePercent = (symbol: string) => {
    if (!prices?.[symbol]) return 0;
    const data = prices[symbol];
    return ((data.close - data.open) / data.open) * 100;
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <ChartLineIcon className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(indices).map(([symbol, name]) => {
          const changePercent = getChangePercent(symbol);
          const isPositive = changePercent >= 0;

          return (
            <div key={symbol} className="space-y-2">
              <p className="text-sm text-muted-foreground">{name}</p>
              <p className="text-2xl font-bold">
                ${prices?.[symbol]?.close.toFixed(2) || "0.00"}
              </p>
              <div className={`flex items-center ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? (
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">
                  {isPositive ? "+" : ""}
                  {changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MarketOverview;