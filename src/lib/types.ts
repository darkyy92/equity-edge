export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: Record<string, string>;
  currencies: Record<string, string>;
}

export interface StockTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  last_updated_utc: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  vwap?: number;
}

export interface StockRecommendation {
  id: string;
  symbol: string;
  shortTermAnalysis?: {
    potentialGrowth: number;
    timeframe: string;
    confidence: number;
  };
  mediumTermAnalysis?: {
    potentialGrowth: number;
    timeframe: string;
    confidence: number;
  };
  longTermAnalysis?: {
    potentialGrowth: number;
    timeframe: string;
    drivers: string[];
  };
  entryRange?: {
    lower: number;
    upper: number;
    confidence: number;
  };
  holdSellRecommendation?: 'hold' | 'sell' | 'review';
  recommendationStrength?: 'green' | 'yellow' | 'red';
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}
