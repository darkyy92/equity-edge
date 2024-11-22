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