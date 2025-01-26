export interface AIProvider {
  analyzeStock: (symbol: string, stockData: any) => Promise<AIAnalysisResponse>;
  getRecommendations: (timeframe: string) => Promise<StockRecommendation[]>;
}

export interface AIAnalysisResponse {
  strategy: string;
  technical: string;
  market: string;
  risks: string;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  reason: string;
  confidence: number;
  potentialGrowth: number;
  primaryDrivers: string[];
}