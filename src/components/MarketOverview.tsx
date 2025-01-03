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

  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: async () => {
      const data: Record<string, any> = {};
      for (const symbol of Object.keys(indices)) {
        try {
          const stockData = await MarketStackService.getDailyPrices(symbol, 1);
          if (stockData && stockData.length > 0) {
            data[symbol] = stockData[0];
            console.log(`Fetched data for ${symbol}:`, stockData[0]);
          }
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err);
        }
      }
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const getChangePercent = (symbol: string) => {
    if (!prices || !prices[symbol]) return 0;
    const data = prices[symbol];
    if (!data.open || !data.close) return 0;
    return ((data.close - data.open) / data.open) * 100;
  };

  if (isLoading) {
    return (
      <Card className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card p-6">
        <div className="text-error">
          Failed to load market data. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <ChartLineIcon className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(indices).map(([symbol, name]) => {
          const stockData = prices?.[symbol];
          const changePercent = getChangePercent(symbol);
          const isPositive = changePercent >= 0;
          const price = stockData?.close;

          if (!stockData || price === undefined) {
            return (
              <div key={symbol} className="space-y-2">
                <p className="text-sm text-muted-foreground">{name}</p>
                <p className="text-2xl font-bold">--</p>
                <div className="text-muted-foreground">
                  <span className="text-sm">No data available</span>
                </div>
              </div>
            );
          }

          return (
            <div key={symbol} className="space-y-2">
              <p className="text-sm text-muted-foreground">{name}</p>
              <p className="text-2xl font-bold">
                ${price.toFixed(2)}
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