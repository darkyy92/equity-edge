import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "./types";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';
const BASE_URL = 'https://api.polygon.io';

export const getTopStocks = async (): Promise<StockTicker[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/gainers?timespan=week&limit=6&apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch top stocks');
    const data = await response.json();
    
    const results = await Promise.all(data.tickers.map(async (ticker: any) => {
      const detailsResponse = await fetch(
        `${BASE_URL}/v3/reference/tickers/${ticker.ticker}?apiKey=${POLYGON_API_KEY}`
      );
      const details = await detailsResponse.json();
      return {
        ...details.results,
        price: ticker.day.c,
        change: ticker.day.c - ticker.day.o,
        changePercent: ((ticker.day.c - ticker.day.o) / ticker.day.o) * 100,
        volume: ticker.day.v,
        vwap: ticker.day.vw
      };
    }));
    
    return results;
  } catch (error) {
    toast({
      title: "Error fetching top stocks",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export const getDailyPrices = async (symbol: string, timeRange: string = "1W"): Promise<any> => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    let startDate: string;
    
    switch(timeRange) {
      case "1D":
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "1W":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "1M":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "3M":
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "1Y":
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "5Y":
        startDate = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    
    const multiplier = timeRange === "1D" ? 5 : 1;
    const timespan = timeRange === "1D" ? "minute" : "day";
    
    const response = await fetch(
      `${BASE_URL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${startDate}/${endDate}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch daily prices');
    const data = await response.json();
    
    if (!data.results) throw new Error('No results found');

    const chartData = data.results.map((item: any) => ({
      timestamp: timeRange === "1D" 
        ? new Date(item.t).toLocaleTimeString()
        : new Date(item.t).toLocaleDateString(),
      price: item.c,
    }));

    return {
      ...data.results[data.results.length - 1],
      chartData,
    };
  } catch (error) {
    console.error('Error fetching daily prices:', error);
    throw error;
  }
};

export const searchStocks = async (query: string): Promise<StockTicker[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&sort=ticker&order=asc&limit=10&apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to search stocks');
    const data = await response.json();
    return data.results;
  } catch (error) {
    toast({
      title: "Error searching stocks",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export const getRecommendedStocks = async (): Promise<StockTicker[]> => {
  const popularStocks = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'TSLA', 'AMD'];
  try {
    const stocks = await Promise.all(
      popularStocks.map(async (symbol) => {
        const response = await fetch(
          `${BASE_URL}/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`
        );
        const priceResponse = await fetch(
          `${BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
        );
        
        const details = await response.json();
        const price = await priceResponse.json();
        
        return {
          ...details.results,
          price: price.results[0].c,
          change: price.results[0].c - price.results[0].o,
          changePercent: ((price.results[0].c - price.results[0].o) / price.results[0].o) * 100,
          volume: price.results[0].v,
          vwap: price.results[0].vw
        };
      })
    );
    
    return stocks
      .sort((a, b) => b.changePercent! - a.changePercent!)
      .slice(0, 2);
  } catch (error) {
    console.error('Error fetching recommended stocks:', error);
    throw error;
  }
};

export * from './types';
export * from './websocket';
