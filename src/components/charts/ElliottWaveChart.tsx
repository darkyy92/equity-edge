import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { WaveAnalysis } from "@/utils/elliottWaveAnalysis";

interface ElliottWaveChartProps {
  data: any[];
  analysis?: {
    patterns: any[];
    supportLevels: number[];
    resistanceLevels: number[];
  };
}

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
        />
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#888888' }}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#8884d8" 
          dot={false}
          strokeWidth={2}
        />
        
        {/* Support Levels */}
        {analysis?.supportLevels.map((level, index) => (
          <ReferenceLine 
            key={`support-${index}`}
            y={level}
            stroke="#22c55e"
            strokeDasharray="3 3"
            opacity={0.5}
          />
        ))}

        {/* Resistance Levels */}
        {analysis?.resistanceLevels.map((level, index) => (
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