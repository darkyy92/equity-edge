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
      // Log the API request for debugging
      console.log(`Fetching data from MarketStack for symbols: ${symbols.join(',')}`);
      
      const response = await fetch(
        `${BASE_URL}/intraday/latest?access_key=${API_KEY}&symbols=${symbols.join(',')}&interval=1min`
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

      // Log the received data for debugging
      console.log('MarketStack API response:', data);

      return data.data.map((stock) => ({
        symbol: stock.symbol,
        price: stock.last || stock.close,
        change: stock.last ? stock.last - stock.open : stock.close - stock.open,
        changePercent: ((stock.last || stock.close) - stock.open) / stock.open * 100,
        volume: stock.volume,
        vwap: (stock.high + stock.low + (stock.last || stock.close)) / 3 // Calculate VWAP
      }));

    } catch (error) {
      console.error('Error in getStockData:', error);
      // Return empty array instead of throwing to prevent UI breakage
      return [];
    }
  }

  static async getDailyPrices(symbol: string, days: number = 1) {
    try {
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&limit=${days}`
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
        vwap: (price.high + price.low + (price.last || price.close)) / 3
      }));

    } catch (error) {
      console.error('Error in getDailyPrices:', error);
      return [];
    }
  }
}