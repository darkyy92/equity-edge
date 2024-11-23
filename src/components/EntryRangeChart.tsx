import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface EntryRangeChartProps {
  data: any[];
  entryRange?: {
    lower: number;
    upper: number;
  };
}

const EntryRangeChart = ({ data, entryRange }: EntryRangeChartProps) => {
  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Price Analysis</h3>
        {entryRange && (
          <Badge variant="outline" className="animate-fade-in">
            Optimal Entry: ${entryRange.lower.toFixed(2)} - ${entryRange.upper.toFixed(2)}
          </Badge>
        )}
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis 
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 17, 0.95)',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              dot={false}
              strokeWidth={2}
            />
            {entryRange && (
              <ReferenceArea
                y1={entryRange.lower}
                y2={entryRange.upper}
                fill="#4ade80"
                fillOpacity={0.1}
                strokeOpacity={0.3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {entryRange && (
        <p className="text-sm text-muted-foreground">
          Consider entering positions when the price falls within the highlighted range for optimal risk/reward ratio.
        </p>
      )}
    </Card>
  );
};

export default EntryRangeChart;