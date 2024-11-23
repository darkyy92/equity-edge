export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: Record<string, string>;
  currencies: Record<string, string>;
}

export interface FundamentalMetrics {
  roe?: number;
  profitMargin?: number;
  revenueGrowth?: number;
  peRatio?: number;
  debtToEquity?: number;
}

export interface TechnicalSignals {
  rsi?: number;
  macd?: string;
  movingAverages?: string;
  supportLevels?: number[];
  resistanceLevels?: number[];
}

export interface MarketContext {
  sectorTrend?: string;
  peerComparison?: string;
  marketSentiment?: string;
  industryPosition?: string;
}

export interface AIRecommendation {
  timeframe: 'short' | 'medium' | 'long';
  potentialGrowth: number;
  confidence: number;
  explanation: string;
  fundamentalMetrics?: FundamentalMetrics;
  technicalSignals?: TechnicalSignals;
  marketContext?: MarketContext;
  primaryDrivers?: string[];
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
  isin?: string;
  valor_number?: string;
  fundamentalMetrics?: FundamentalMetrics;
  technicalSignals?: TechnicalSignals;
  marketContext?: MarketContext;
  primaryDrivers?: string[];
  aiRecommendation?: AIRecommendation;
}