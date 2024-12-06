import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

interface PriceChartProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  chartData?: Array<{
    timestamp: string;
    price: number;
  }>;
}

const PriceChart = ({ timeRange, setTimeRange, chartData }: PriceChartProps) => {
  const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  return (
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
          <LineChart data={chartData || []}>
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
    </Card>
  );
};

export default PriceChart;