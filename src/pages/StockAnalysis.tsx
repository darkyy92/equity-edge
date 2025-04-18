import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import { getDailyPrices } from "@/lib/api"; // Removed as src/lib/api.ts is deleted
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LastUpdated from "@/components/LastUpdated";
import { cn } from "@/lib/utils";
import AdvancedAnalysis from "@/components/AdvancedAnalysis";
import ComprehensiveAnalysis from "@/components/ComprehensiveAnalysis";
import EntryRangeChart from "@/components/EntryRangeChart";
import HoldSellIndicator from "@/components/HoldSellIndicator";
import { supabase } from "@/integrations/supabase/client";
import { StockRecommendationAdapter } from "@/services/StockRecommendationAdapter";

// type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"; // Removed as chart is removed

const StockAnalysis = () => {
  const { symbol } = useParams();
  // const [timeRange, setTimeRange] = useState<TimeRange>("1W"); // Removed as chart is removed

  // Removed priceData query as src/lib/api.ts is deleted
  // Removed priceData query as src/lib/api.ts is deleted
  const priceData: any = null; // Placeholder
  const dataUpdatedAt: number | undefined = undefined; // Placeholder

  const { data: recommendation } = useQuery({
    queryKey: ['stockRecommendation', symbol],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('symbol', symbol)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // Use our adapter to handle property differences
      return data ? StockRecommendationAdapter.adaptForStockAnalysis(data) : null;
    },
    enabled: !!symbol,
  });

  if (!symbol) return <div>Invalid stock symbol</div>;

  // Removed change calculations as historical open price is not available from recommendation
  // const change = priceData ? priceData.c - priceData.o : 0;
  // const changePercent = priceData ? (change / priceData.o) * 100 : 0;
  // const isPositive = change >= 0;

  // const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"]; // Removed as chart is removed

 return (
   <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-4xl font-bold">{symbol}</h1>
              {/* Removed LastUpdated as dataUpdatedAt is no longer available */}
              {/* {dataUpdatedAt && <LastUpdated timestamp={dataUpdatedAt} />} */}
            </div>
            {/* Use current_price from recommendation */}
            <p className="text-2xl font-semibold">
              ${recommendation?.current_price?.toFixed(2) ?? 'N/A'}
              {/* Removed change display */}
              {/* <span className={`ml-2 text-lg ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span> */}
            </p>
          </div>
          {/* Removed trend icon */}
          {/* {isPositive ? (
            <TrendingUpIcon className="w-8 h-8 text-success" />
          ) : (
            <TrendingDownIcon className="w-8 h-8 text-error" />
          )} */}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Removed Price Chart Card as historical data is not available */}
          {/* <Card className="p-6">
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
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.1} />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
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
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    cursor={{ stroke: '#8884d8', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#8884d8', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
          <Card className="p-6">
             <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
             <p className="text-muted-foreground">Historical price chart data is currently unavailable.</p>
          </Card>

          <div className="space-y-6">
            {/* Removed EntryRangeChart as historical data is not available */}
            {/* {recommendation?.entry_range && (
              <EntryRangeChart
                data={[]}
                entryRange={recommendation.entry_range}
              />
            )} */}
            {recommendation?.entry_range && (
               <Card className="p-6">
                 <h2 className="text-xl font-semibold mb-4">Entry Range Chart</h2>
                 <p className="text-muted-foreground">Entry range chart data is currently unavailable.</p>
               </Card>
            )}
            
            {recommendation?.hold_sell_recommendation && (
              <HoldSellIndicator
                recommendation={recommendation.hold_sell_recommendation}
                strength={recommendation.recommendation_strength || 'yellow'}
                explanation={recommendation.explanation || ''}
              />
            )}
          </div>
        </div>

        {/* Removed historicalData prop from AdvancedAnalysis */}
        <AdvancedAnalysis
          symbol={symbol || ''}
          historicalData={[]} // Pass empty array as historical data is not available
        />

        <ComprehensiveAnalysis symbol={symbol || ''} />
        
        <Card className="p-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">AI Analysis</h2>
              <Badge variant="outline" className="mb-2">AI Generated</Badge>
            </div>
            <div className="space-y-6 prose dark:prose-invert max-w-none">
              <p>AI analysis is currently unavailable.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StockAnalysis;
