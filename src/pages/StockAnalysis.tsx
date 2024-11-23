import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDailyPrices } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LastUpdated from "@/components/LastUpdated";
import { getAIAnalysis, type AIAnalysisResponse } from "@/lib/openai";
import { cn } from "@/lib/utils";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

const StockAnalysis = () => {
  const { symbol } = useParams();
  const [timeRange, setTimeRange] = useState<TimeRange>("1W");

  const { data: priceData, dataUpdatedAt } = useQuery({
    queryKey: ['stockPrice', symbol, timeRange],
    queryFn: () => getDailyPrices(symbol || '', timeRange),
    enabled: !!symbol,
    refetchInterval: 60000,
  });

  const { data: aiAnalysis, isLoading: isAILoading } = useQuery<AIAnalysisResponse | null>({
    queryKey: ['aiAnalysis', symbol],
    queryFn: () => getAIAnalysis(symbol || '', priceData),
    enabled: !!symbol && !!priceData,
    refetchInterval: 300000,
  });

  if (!symbol) return <div>Invalid stock symbol</div>;

  const change = priceData ? priceData.c - priceData.o : 0;
  const changePercent = priceData ? (change / priceData.o) * 100 : 0;
  const isPositive = change >= 0;

  const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-4xl font-bold">{symbol}</h1>
              {dataUpdatedAt && <LastUpdated timestamp={dataUpdatedAt} />}
            </div>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Price Chart</h2>
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData?.chartData || []}>
                <XAxis 
                  dataKey="timestamp"
                  stroke="#888888"
                  fontSize={12}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 17, 17, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#888888' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 h-fit">
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

          <Card className={cn(
            "p-6 relative overflow-hidden",
            isAILoading && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400 before:via-pink-500 before:to-red-500 before:animate-pulse before:opacity-20"
          )}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">AI Analysis</h2>
                <Badge variant="outline" className="mb-2">AI Generated</Badge>
              </div>
              {isAILoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              ) : (
                <div className="space-y-6 prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.strategy || '' }} />
                  <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.technical || '' }} />
                  <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.market || '' }} />
                  <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.risks || '' }} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;