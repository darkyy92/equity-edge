import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  BookOpenIcon,
  TrendingUpIcon,
  GlobeIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldIcon,
  NewspaperIcon,
  CalculatorIcon,
  RocketIcon,
  UserIcon,
} from "lucide-react";

interface ComprehensiveAnalysisProps {
  symbol: string;
}

const ComprehensiveAnalysis = ({ symbol }: ComprehensiveAnalysisProps) => {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ["comprehensiveAnalysis", symbol],
    queryFn: async () => {
      // Simulated analysis data - in a real implementation, this would call your backend API
      return {
        fundamental: {
          pe: 25.4,
          roe: 18.2,
          profitMargin: 15.6,
          revenueGrowth: 12.3,
        },
        industry: {
          marketShare: 15,
          competitorCount: 5,
          marketGrowth: 8.5,
        },
        macro: {
          interestRateImpact: "Moderate",
          inflationRisk: "Low",
          geopoliticalRisk: "Medium",
        },
        management: {
          ceoTenure: 5,
          executiveScore: 8.5,
          strategyRating: "Strong",
        },
        technical: {
          trend: "Bullish",
          rsi: 65,
          macd: "Positive",
        },
        risks: {
          financial: "Low",
          operational: "Medium",
          market: "Medium",
        },
        news: [
          {
            title: "New Product Launch",
            impact: "Positive",
            date: "2024-02-15",
          },
          {
            title: "Q4 Earnings Beat",
            impact: "Positive",
            date: "2024-02-01",
          },
        ],
        valuation: {
          intrinsicValue: 150.25,
          currentPrice: 142.30,
          upside: 5.6,
        },
        longTerm: {
          growthPotential: "High",
          innovationScore: 8.2,
          sustainabilityRating: "A-",
        },
        recommendation: {
          rating: "Buy",
          confidence: 85,
          timeHorizon: "12 months",
        },
      };
    },
    staleTime: 300000, // 5 minutes
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

  const sections = [
    {
      title: "Fundamental Analysis",
      icon: <BookOpenIcon className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">P/E Ratio</p>
            <p className="text-lg font-semibold">{analysis?.fundamental.pe}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROE</p>
            <p className="text-lg font-semibold">{analysis?.fundamental.roe}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-lg font-semibold">{analysis?.fundamental.profitMargin}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue Growth</p>
            <p className="text-lg font-semibold">{analysis?.fundamental.revenueGrowth}%</p>
          </div>
        </div>
      ),
    },
    {
      title: "Industry Analysis",
      icon: <GlobeIcon className="w-5 h-5" />,
      content: (
        <div>
          <p className="mb-2">Market Position</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Market Share</span>
              <span>{analysis?.industry.marketShare}%</span>
            </div>
            <div className="flex justify-between">
              <span>Market Growth</span>
              <span>{analysis?.industry.marketGrowth}%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Management",
      icon: <UsersIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>CEO Tenure</span>
            <span>{analysis?.management.ceoTenure} years</span>
          </div>
          <div className="flex justify-between">
            <span>Strategy Rating</span>
            <Badge>{analysis?.management.strategyRating}</Badge>
          </div>
        </div>
      ),
    },
    // Add more sections as needed
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comprehensive Analysis</h3>
        <Badge 
          variant="outline" 
          className={
            analysis?.recommendation.rating === "Buy" 
              ? "bg-success/10 text-success" 
              : analysis?.recommendation.rating === "Sell" 
              ? "bg-error/10 text-error" 
              : "bg-muted"
          }
        >
          {analysis?.recommendation.rating} ({analysis?.recommendation.confidence}% Confidence)
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

      <div className="space-y-2">
        <h4 className="font-medium">Latest News & Developments</h4>
        <div className="space-y-2">
          {analysis?.news.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.title}</span>
              <Badge variant="outline" className={item.impact === "Positive" ? "text-success" : "text-error"}>
                {item.impact}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Recommendation based on comprehensive analysis over {analysis?.recommendation.timeHorizon} time horizon.
          Current valuation suggests {analysis?.valuation.upside}% potential upside.
        </p>
      </div>
    </Card>
  );
};

export default ComprehensiveAnalysis;