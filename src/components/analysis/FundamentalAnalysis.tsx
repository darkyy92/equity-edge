import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface FundamentalAnalysisProps {
  symbol: string;
}

const FundamentalAnalysis = ({ symbol }: FundamentalAnalysisProps) => {
  const { data: fundamentals } = useQuery({
    queryKey: ["fundamentals", symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.polygon.io/v2/reference/financials/${symbol}?apiKey=${process.env.POLYGON_API_KEY}`
      );
      const data = await response.json();
      return data.results?.[0] || null;
    },
  });

  if (!fundamentals) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">P/E Ratio</p>
        <p className="text-lg font-semibold">
          {(fundamentals.marketcap / fundamentals.earnings).toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">ROE</p>
        <p className="text-lg font-semibold">
          {((fundamentals.earnings / fundamentals.equity) * 100).toFixed(2)}%
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Profit Margin</p>
        <p className="text-lg font-semibold">
          {((fundamentals.netIncome / fundamentals.revenue) * 100).toFixed(2)}%
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Revenue Growth</p>
        <p className="text-lg font-semibold">
          {((fundamentals.revenue - fundamentals.previousRevenue) / fundamentals.previousRevenue * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default FundamentalAnalysis;