import { Card } from "@/components/ui/card";
import { ChartLineIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

const MarketOverview = () => {
  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <ChartLineIcon className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">S&P 500</p>
          <p className="text-2xl font-bold">4,783.45</p>
          <div className="flex items-center text-success">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">+1.23%</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">NASDAQ</p>
          <p className="text-2xl font-bold">15,123.45</p>
          <div className="flex items-center text-success">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">+0.89%</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">DOW JONES</p>
          <p className="text-2xl font-bold">37,654.32</p>
          <div className="flex items-center text-error">
            <TrendingDownIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">-0.45%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketOverview;