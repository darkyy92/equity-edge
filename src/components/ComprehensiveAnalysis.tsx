import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpenIcon,
  TrendingUpIcon,
  GlobeIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import FundamentalAnalysis from "./analysis/FundamentalAnalysis";
import NewsAnalysis from "./analysis/NewsAnalysis";
import LoadingLogo from "./LoadingLogo";

interface ComprehensiveAnalysisProps {
  symbol: string;
}

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';

const ComprehensiveAnalysis = ({ symbol }: ComprehensiveAnalysisProps) => {
  const { data: details, isLoading: isLoadingDetails, error: detailsError, refetch: refetchDetails } = useQuery({
    queryKey: ["companyDetails", symbol],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch company details');
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error('Error fetching company details:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  const { data: aggregates, isLoading: isLoadingAggregates, error: aggregatesError, refetch: refetchAggregates } = useQuery({
    queryKey: ["aggregates", symbol],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch aggregates');
        const data = await response.json();
        return data.results?.[0];
      } catch (error) {
        console.error('Error fetching aggregates:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 60000, // 1 minute
  });

  const isLoading = isLoadingDetails || isLoadingAggregates;
  const error = detailsError || aggregatesError;

  const handleRetry = () => {
    toast({
      title: "Retrying...",
      description: "Fetching fresh data for your analysis.",
    });
    refetchDetails();
    refetchAggregates();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <LoadingLogo />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground text-center">
            Oops! Something went wrong while loading your analysis.
          </p>
          <Button
            variant="outline"
            onClick={handleRetry}
            className="flex items-center space-x-2"
          >
            <RefreshCcwIcon className="w-4 h-4" />
            <span>Retry</span>
          </Button>
        </div>
      </Card>
    );
  }

  if (!details || !aggregates) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No data available for this stock.
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