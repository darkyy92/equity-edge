import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "./types";
import { supabase } from "@/integrations/supabase/client";

const MARKETSTACK_API_KEY = 'bf765ce0b1e243a39197f24a5c347d00';
const BASE_URL = 'https://api.marketstack.com/v2';

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

const generateAIRecommendation = (stock: any, timeframe: 'short' | 'medium' | 'long') => {
  // Simulate AI-driven analysis based on stock metrics
  const volatility = Math.abs(stock.changePercent);
  const volume = stock.volume;
  const priceLevel = stock.price;
  
  let confidence: number;
  let potentialGrowth: number;
  
  switch(timeframe) {
    case 'short':
      confidence = Math.min(85, 60 + (volatility * 2));
      potentialGrowth = volatility * (Math.random() > 0.5 ? 1.5 : -1.5);
      break;
    case 'medium':
      confidence = Math.min(80, 55 + (volume / 1000000));
      potentialGrowth = (volatility * 1.2) * (Math.random() > 0.4 ? 1 : -1);
      break;
    case 'long':
      confidence = Math.min(75, 50 + (priceLevel / 10));
      potentialGrowth = (volatility * 0.8) * (Math.random() > 0.3 ? 1 : -1);
      break;
  }

  return {
    confidence: Math.round(confidence),
    potentialGrowth: Number(potentialGrowth.toFixed(2)),
    timeframe
  };
};

export const getTopStocks = async (timeframe: 'short' | 'medium' | 'long' = 'short'): Promise<StockTicker[]> => {
  try {
    const response = await fetchWithCORS(
      `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/gainers?timespan=day&limit=10&apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch top stocks');
    const data = await response.json();
    
    const results = await Promise.all(data.tickers.map(async (ticker: any) => {
      const detailsResponse = await fetchWithCORS(
        `${BASE_URL}/v3/reference/tickers/${ticker.ticker}?apiKey=${POLYGON_API_KEY}`
      );
      const details = await detailsResponse.json();
      
      const stockData = {
        ...details.results,
        price: ticker.day.c,
        change: ticker.day.c - ticker.day.o,
        changePercent: ((ticker.day.c - ticker.day.o) / ticker.day.o) * 100,
        volume: ticker.day.v,
        vwap: ticker.day.vw
      };

      const recommendation = generateAIRecommendation(stockData, timeframe);
      
      return {
        ...stockData,
        aiRecommendation: recommendation
      };
    }));
    
    // Sort based on the timeframe strategy
    return results.sort((a, b) => {
      if (timeframe === 'short') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
      if (timeframe === 'medium') return b.volume - a.volume;
      return b.market_cap - a.market_cap;
    }).slice(0, 6);
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
    let interval = 'daily';
    
    switch(timeRange) {
      case "1D":
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        interval = 'hourly';
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

    const response = await fetch(
      `${BASE_URL}/timeseries?access_key=${MARKETSTACK_API_KEY}&symbols=${symbol}&interval=${interval}&date_from=${startDate}&date_to=${endDate}`
    );

    if (!response.ok) throw new Error('Failed to fetch daily prices');
    const data = await response.json();

    if (!data.data) throw new Error('No results found');

    // Transform data to match existing format
    const lastEntry = data.data[0];
    const chartData = data.data.reverse().map((item: any) => ({
      timestamp: timeRange === "1D"
        ? new Date(item.date).toLocaleTimeString()
        : new Date(item.date).toLocaleDateString(),
      price: item.close,
    }));

    return {
      c: lastEntry.close,
      o: lastEntry.open,
      h: lastEntry.high,
      l: lastEntry.low,
      v: lastEntry.volume,
      vw: (lastEntry.high + lastEntry.low) / 2, // Approximate VWAP
      chartData,
    };
    
    const multiplier = timeRange === "1D" ? 5 : 1;
    const timespan = timeRange === "1D" ? "minute" : "day";
    
    const response = await fetchWithCORS(
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
      `${BASE_URL}/tickers?access_key=${MARKETSTACK_API_KEY}&search=${encodeURIComponent(query)}&limit=10`
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
          `${BASE_URL}/tickers/${symbol}?access_key=${MARKETSTACK_API_KEY}`
        );
        const priceResponse = await fetch(
          `${BASE_URL}/intraday/latest?access_key=${MARKETSTACK_API_KEY}&symbols=${symbol}`
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