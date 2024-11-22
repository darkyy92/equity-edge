import { toast } from "@/components/ui/use-toast";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';
const BASE_URL = 'https://api.polygon.io';

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
}

export interface DailyPrice {
  c: number; // close price
  h: number; // highest price
  l: number; // lowest price
  n: number; // number of transactions
  o: number; // open price
  t: number; // timestamp
  v: number; // trading volume
  vw: number; // volume weighted average price
}

export const getMarketStatus = async (): Promise<MarketStatus> => {
  try {
    const response = await fetch(`${BASE_URL}/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch market status');
    return await response.json();
  } catch (error) {
    toast({
      title: "Error fetching market status",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export const getTopStocks = async (): Promise<StockTicker[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/v3/reference/tickers?market=stocks&active=true&sort=market_cap&order=desc&limit=3&apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch top stocks');
    const data = await response.json();
    return data.results;
  } catch (error) {
    toast({
      title: "Error fetching top stocks",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export const getDailyPrices = async (symbol: string): Promise<DailyPrice> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${today}/${today}?adjusted=true&sort=desc&limit=1&apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch daily prices');
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    toast({
      title: "Error fetching daily prices",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

let ws: WebSocket | null = null;

export const connectWebSocket = (onMessage: (data: any) => void) => {
  if (ws) return;

  ws = new WebSocket('wss://delayed.polygon.io/stocks');

  ws.onopen = () => {
    console.log('Connected to Polygon WebSocket');
    if (ws) {
      ws.send(JSON.stringify({
        action: 'auth',
        params: POLYGON_API_KEY
      }));
      
      // Subscribe to some major stocks
      ws.send(JSON.stringify({
        action: 'subscribe',
        params: 'T.AAPL,T.MSFT,T.GOOGL'
      }));
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    toast({
      title: "WebSocket Error",
      description: "Failed to connect to live updates",
      variant: "destructive",
    });
  };

  ws.onclose = () => {
    console.log('Disconnected from Polygon WebSocket');
    ws = null;
  };
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};