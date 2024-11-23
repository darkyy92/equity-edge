import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpenIcon,
  TrendingUpIcon,
  GlobeIcon,
  UsersIcon,
} from "lucide-react";
import FundamentalAnalysis from "./analysis/FundamentalAnalysis";
import NewsAnalysis from "./analysis/NewsAnalysis";

interface ComprehensiveAnalysisProps {
  symbol: string;
}

const ComprehensiveAnalysis = ({ symbol }: ComprehensiveAnalysisProps) => {
  const { data: details } = useQuery({
    queryKey: ["companyDetails", symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${process.env.POLYGON_API_KEY}`
      );
      const data = await response.json();
      return data.results;
    },
  });

  const { data: aggregates } = useQuery({
    queryKey: ["aggregates", symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${process.env.POLYGON_API_KEY}`
      );
      const data = await response.json();
      return data.results?.[0];
    },
  });

  if (!details || !aggregates) {
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

  const sections = [
    {
      title: "Fundamental Analysis",
      icon: <BookOpenIcon className="w-5 h-5" />,
      content: <FundamentalAnalysis symbol={symbol} />,
    },
    {
      title: "Industry Analysis",
      icon: <GlobeIcon className="w-5 h-5" />,
      content: (
        <div>
          <p className="mb-2">Market Position</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Market Cap</span>
              <span>${(details.market_cap / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span>Industry</span>
              <span>{details.sic_description}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Latest News & Developments",
      icon: <TrendingUpIcon className="w-5 h-5" />,
      content: <NewsAnalysis symbol={symbol} />,
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comprehensive Analysis</h3>
        <Badge variant="outline">
          {aggregates.c > aggregates.o ? "Bullish" : "Bearish"} Trend
        </Badge>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-2">
              {section.icon}
              <h4 className="font-medium">{section.title}</h4>
            </div>
            {section.content}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Analysis based on real-time market data from Polygon.io
        </p>
      </div>
    </Card>
  );
};

export default ComprehensiveAnalysis;