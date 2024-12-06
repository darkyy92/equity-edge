import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { WaveAnalysis } from "@/utils/elliottWaveAnalysis";
import { format, isValid, parseISO } from "date-fns";

interface ElliottWaveChartProps {
  data: any[];
  analysis?: {
    patterns: any[];
    supportLevels: number[];
    resistanceLevels: number[];
  };
}

const formatDate = (dateStr: string | number) => {
  try {
    if (typeof dateStr === 'string') {
      const parsedDate = parseISO(dateStr);
      if (!isValid(parsedDate)) {
        console.error('Invalid date:', dateStr);
        return '';
      }
      return format(parsedDate, "MMM d, yyyy");
    }
    const date = new Date(dateStr);
    if (!isValid(date)) {
      console.error('Invalid date:', dateStr);
      return '';
    }
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="mb-1 text-sm font-medium">
          {formatDate(label)}
        </p>
        <p className="text-sm">
          <span className="font-medium text-muted-foreground">PRICE: </span>
          <span className="font-mono">${payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ElliottWaveChart = ({ data, analysis }: ElliottWaveChartProps) => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.1} />
        <XAxis 
          dataKey="date" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const formattedDate = formatDate(value);
            return formattedDate ? format(parseISO(formattedDate), "MMM d") : '';
          }}
        />
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#8884d8" 
          dot={false}
          strokeWidth={2}
        />
        
        {analysis?.supportLevels?.map((level, index) => (
          <ReferenceLine 
            key={`support-${index}`}
            y={level}
            stroke="#22c55e"
            strokeDasharray="3 3"
            opacity={0.5}
          />
        ))}

        {analysis?.resistanceLevels?.map((level, index) => (
          <ReferenceLine 
            key={`resistance-${index}`}
            y={level}
            stroke="#ef4444"
            strokeDasharray="3 3"
            opacity={0.5}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ElliottWaveChart;