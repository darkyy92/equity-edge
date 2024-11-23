import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "../types";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';
const BASE_URL = 'https://api.polygon.io';

const fetchWithCORS = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  
  return fetch(url, defaultOptions);
};

export const fetchStockData = async (symbol: string): Promise<any> => {
  try {
    const [detailsResponse, priceResponse] = await Promise.all([
      fetchWithCORS(`${BASE_URL}/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`),
      fetchWithCORS(`${BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`)
    ]);

    if (!detailsResponse.ok || !priceResponse.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const details = await detailsResponse.json();
    const price = await priceResponse.json();

    return {
      ...details.results,
      price: price.results[0].c,
      change: price.results[0].c - price.results[0].o,
      changePercent: ((price.results[0].c - price.results[0].o) / price.results[0].o) * 100,
      volume: price.results[0].v,
      vwap: price.results[0].vw
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchTopStocks = async (type: 'gainers' | 'most-active' | 'market-cap'): Promise<any[]> => {
  try {
    const endpoint = type === 'gainers' 
      ? 'gainers'
      : type === 'most-active'
        ? 'most-active'
        : 'tickers';
        
    const params = type === 'market-cap'
      ? '?market=stocks&active=true&sort=market_cap&order=desc&limit=10'
      : '?timespan=day&limit=10';
      
    const response = await fetchWithCORS(
      `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/${endpoint}${params}&apiKey=${POLYGON_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch top stocks');
    const data = await response.json();
    
    return Promise.all(
      (data.tickers || data.results || []).slice(0, 10).map(async (ticker: any) => {
        return await fetchStockData(ticker.ticker || ticker.symbol);
      })
    );
  } catch (error) {
    toast({
      title: "Error fetching top stocks",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};