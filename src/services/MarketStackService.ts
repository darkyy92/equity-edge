const API_KEY = '959d63ed3d8e994a24448aad1ccc8787';
const BASE_URL = 'https://api.marketstack.com/v1';

interface MarketStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Array<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adj_high: number | null;
    adj_low: number | null;
    adj_close: number;
    adj_open: number | null;
    adj_volume: number | null;
    split_factor: number;
    dividend: number;
    symbol: string;
    exchange: string;
    date: string;
  }>;
}

export class MarketStackService {
  static async getStockData(symbols: string[]) {
    try {
      console.log('Fetching stock data for symbols:', symbols);
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbols.join(',')}&limit=1`
      );

      if (!response.ok) {
        console.error('MarketStack API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json() as MarketStackResponse;
      console.log('Raw MarketStack API Response:', JSON.stringify(data, null, 2));
      
      if (!data.data || data.data.length === 0) {
        console.error('No data returned from MarketStack API');
        return [];
      }

      const transformedData = data.data.map((stock) => ({
        symbol: stock.symbol,
        price: stock.close,
        change: stock.close - stock.open,
        changePercent: ((stock.close - stock.open) / stock.open) * 100,
        volume: stock.volume,
        vwap: stock.adj_close || stock.close
      }));

      console.log('Transformed stock data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error in getStockData:', error);
      return [];
    }
  }

  static async getDailyPrices(symbol: string, days: number = 1) {
    try {
      console.log(`Fetching daily prices for ${symbol}, days: ${days}`);
      const response = await fetch(
        `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&limit=${days}`
      );

      if (!response.ok) {
        console.error('MarketStack API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error('Failed to fetch daily prices');
      }

      const data = await response.json() as MarketStackResponse;
      console.log('Raw MarketStack Daily Prices Response:', JSON.stringify(data, null, 2));
      
      if (!data.data || data.data.length === 0) {
        console.error('No data returned from MarketStack API');
        return [];
      }

      const transformedData = data.data.map((price) => ({
        date: new Date(price.date),
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
        volume: price.volume,
        vwap: price.adj_close || price.close
      }));

      console.log('Transformed daily prices:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error in getDailyPrices:', error);
      return [];
    }
  }
}