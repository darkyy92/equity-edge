import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { generateMonteCarlo } from "@/utils/monteCarloSimulation";
import { calculateElliottWave } from "@/utils/elliottWaveAnalysis";
import ElliottWaveChart from "./charts/ElliottWaveChart";
import MonteCarloChart from "./charts/MonteCarloChart";

interface AdvancedAnalysisProps {
  symbol: string;
  historicalData: any[];
}

const AdvancedAnalysis = ({ symbol, historicalData }: AdvancedAnalysisProps) => {
  const [timeframe, setTimeframe] = useState("1M");

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["advancedAnalysis", symbol, timeframe],
    queryFn: async () => {
      const simulatedPaths = generateMonteCarlo(historicalData, 10000);
      const elliotWavePatterns = calculateElliottWave(historicalData);
      
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
          <ElliottWaveChart data={historicalData} />
        </div>

        <div>
          <h4 className="font-medium mb-2">Monte Carlo Simulation</h4>
          <MonteCarloChart data={analysis?.monteCarlo || []} />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Probability Analysis</h4>
          <p className="text-sm text-muted-foreground">
            Based on 10,000 Monte Carlo simulations over {timeframe}:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>70% chance of price between ${analysis?.monteCarlo[0]?.lowerBound.toFixed(2)} and ${analysis?.monteCarlo[0]?.upperBound.toFixed(2)}</li>
            <li>Median projected price: ${analysis?.monteCarlo[0]?.median.toFixed(2)}</li>
            <li>Current Elliott Wave: Wave {analysis?.elliottWave?.currentWave} ({analysis?.elliottWave?.confidence.toFixed(1)}% confidence)</li>
            <li>Next target: ${analysis?.elliottWave?.nextTarget?.toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedAnalysis;