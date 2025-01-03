import axios from 'axios';

const MARKETSTACK_API_KEY = '959d63ed3d8e994a24448aad1ccc8787';
const BASE_URL = 'https://api.marketstack.com/v1';

export interface StockData {
  ticker: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  date: string;
}

export class MarketStackService {
  static async getStockData(symbols: string[]): Promise<StockData[]> {
    try {
      const symbolsString = symbols.join(',');
      const response = await axios.get(
        `${BASE_URL}/eod`,
        {
          params: {
            access_key: MARKETSTACK_API_KEY,
            symbols: symbolsString,
            limit: 1
          },
        }
      );

      return response.data.data.map((item: any) => ({
        ticker: item.symbol,
        close: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
        volume: item.volume,
        date: item.date,
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new Error('Failed to fetch stock data');
    }
  }

  static async getDailyPrices(symbol: string, days: number = 30): Promise<StockData[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/eod`,
        {
          params: {
            access_key: MARKETSTACK_API_KEY,
            symbols: symbol,
            limit: days
          },
        }
      );

      return response.data.data.map((item: any) => ({
        ticker: item.symbol,
        close: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
        volume: item.volume,
        date: item.date,
      }));
    } catch (error) {
      console.error('Error fetching daily prices:', error);
      throw new Error('Failed to fetch daily prices');
    }
  }
}