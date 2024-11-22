import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyPrices } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockAnalysis = () => {
  const { symbol } = useParams();

  const { data: priceData } = useQuery({
    queryKey: ['stockPrice', symbol],
    queryFn: () => getDailyPrices(symbol || ''),
    enabled: !!symbol,
    refetchInterval: 60000,
  });

  if (!symbol) return <div>Invalid stock symbol</div>;

  const change = priceData ? priceData.c - priceData.o : 0;
  const changePercent = priceData ? (change / priceData.o) * 100 : 0;
  const isPositive = change >= 0;

  // Mock data for the chart - in a real app, we'd fetch historical data
  const chartData = [
    { date: '1D', price: priceData?.o || 0 },
    { date: '2D', price: priceData?.c || 0 },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{symbol}</h1>
            <p className="text-2xl font-semibold">
              ${priceData?.c.toFixed(2) || '0.00'}
              <span className={`ml-2 text-lg ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </p>
          </div>
          {isPositive ? (
            <TrendingUpIcon className="w-8 h-8 text-success" />
          ) : (
            <TrendingDownIcon className="w-8 h-8 text-error" />
          )}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open</span>
                <span>${priceData?.o.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High</span>
                <span>${priceData?.h.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low</span>
                <span>${priceData?.l.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span>{priceData?.v.toLocaleString() || '0'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <div className="space-y-4">
              <Badge variant="outline" className="mb-2">AI Generated</Badge>
              <p className="text-muted-foreground">
                Analysis loading...
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;