import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import MarketOverview from "@/components/MarketOverview";
import StockCard from "@/components/StockCard";
import RecommendationCard from "@/components/RecommendationCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - would be replaced with API calls
  const topStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 3.45, changePercent: 1.89 },
    { symbol: "MSFT", name: "Microsoft", price: 378.85, change: -2.15, changePercent: -0.57 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.65, change: 1.25, changePercent: 0.88 },
  ];

  const recommendations = [
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      recommendation: "Buy" as const,
      confidence: 85,
      reason: "Strong AI market position and continued demand for GPUs in data centers",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      recommendation: "Hold" as const,
      confidence: 65,
      reason: "Stable advertising revenue but uncertainty around metaverse investments",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold">Market Pulse</h1>
          <p className="text-muted-foreground">AI-Powered Stock Analysis & Recommendations</p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <MarketOverview />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Top Movers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.symbol} {...rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;