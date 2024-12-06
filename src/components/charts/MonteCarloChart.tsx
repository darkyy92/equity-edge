import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from "recharts";

interface MonteCarloChartProps {
  data: any[];
}

const MonteCarloChart = ({ data }: MonteCarloChartProps) => (
  <div className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.1} />
        <XAxis dataKey="date" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="upperBound"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.1}
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.1}
        />
        <Line type="monotone" dataKey="median" stroke="#ffc658" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default MonteCarloChart;