const API_KEY = '959d63ed3d8e994a24448aad1ccc8787';
const BASE_URL = 'https://api.marketstack.com/v2';

interface MarketStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Array<{
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    exchange: string;
    last: number;
  }>;
}

export class MarketStackService {
  static async getStockData(symbols: string[]) {
    try {
      const response = await fetch(
        `${BASE_URL}/intraday?access_key=${API_KEY}&symbols=${symbols.join(',')}&interval=15min&limit=1`
      );

      if (!response.ok) {
        console.error('MarketStack API Error:', response.status, response.statusText);
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json() as MarketStackResponse;
      
      if (!data.data || data.data.length === 0) {
        console.error('No data returned from MarketStack API');
        return [];
      }

      return data.data.map((stock) => ({
        symbol: stock.symbol,
        price: stock.last || stock.close,
        change: (stock.last || stock.close) - stock.open,
        changePercent: ((stock.last || stock.close) - stock.open) / stock.open * 100,
        volume: stock.volume,
        vwap: stock.close // Using close as VWAP since intraday doesn't provide VWAP
      }));

    } catch (error) {
      console.error('Error in getStockData:', error);
      return [];
    }
  }

  static async getDailyPrices(symbol: string, days: number = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/intraday?access_key=${API_KEY}&symbols=${symbol}&interval=15min&limit=${days * 28}` // 28 15-min intervals in a trading day
      );

      if (!response.ok) {
        console.error('MarketStack API Error:', response.status, response.statusText);
        throw new Error('Failed to fetch daily prices');
      }

      const data = await response.json() as MarketStackResponse;
      
      if (!data.data || data.data.length === 0) {
        console.error('No data returned from MarketStack API');
        return [];
      }

      return data.data.map((price) => ({
        date: new Date(price.date),
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.last || price.close,
        volume: price.volume,
        vwap: price.close // Using close as VWAP since intraday doesn't provide VWAP
      }));

    } catch (error) {
      console.error('Error in getDailyPrices:', error);
      return [];
    }
  }
}