import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

interface AdvancedAnalysisProps {
  symbol: string;
  historicalData: any[];
}

const AdvancedAnalysis = ({ symbol, historicalData }: AdvancedAnalysisProps) => {
  const [timeframe, setTimeframe] = useState("1M");

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["advancedAnalysis", symbol, timeframe],
    queryFn: async () => {
      // Simulate Elliott Wave and Monte Carlo analysis
      // In a real implementation, this would call your backend API
      const simulatedPaths = generateMonteCarlo(historicalData, 10000);
      const elliotWavePatterns = analyzeElliottWave(historicalData);
      
      return {
        monteCarlo: simulatedPaths,
        elliottWave: elliotWavePatterns,
      };
    },
    enabled: !!historicalData && historicalData.length > 0,
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Advanced Technical Analysis</h3>
        <Badge variant="outline">AI Powered</Badge>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Elliott Wave Pattern</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Monte Carlo Simulation</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analysis?.monteCarlo?.slice(0, 100) || []}>
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
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Probability Analysis</h4>
          <p className="text-sm text-muted-foreground">
            Based on 10,000 Monte Carlo simulations over {timeframe}:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>70% chance of price between ${analysis?.monteCarlo?.lowerBound} and ${analysis?.monteCarlo?.upperBound}</li>
            <li>Median projected price: ${analysis?.monteCarlo?.median}</li>
            <li>Current Elliott Wave: {analysis?.elliottWave?.currentWave}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

// Helper functions for analysis (simplified for demo)
const generateMonteCarlo = (historicalData: any[], iterations: number) => {
  // Simplified Monte Carlo simulation
  return {
    lowerBound: 100,
    upperBound: 150,
    median: 125,
  };
};

const analyzeElliottWave = (historicalData: any[]) => {
  // Simplified Elliott Wave analysis
  return {
    currentWave: "Wave 3 of 5",
    confidence: 0.8,
  };
};

export default AdvancedAnalysis;