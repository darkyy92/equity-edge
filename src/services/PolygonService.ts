import axios from 'axios';

const MARKETSTACK_API_KEY = 'bf765ce0b1e243a39197f24a5c347d00';
const BASE_URL = 'https://api.marketstack.com/v2';

export interface StockData {
  ticker: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  vwap: number;
  timestamp: number;
}

export class MarketStackService {
  static async getStockData(symbols: string[]): Promise<StockData[]> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const promises = symbols.map(async (symbol) => {
      const response = await axios.get(
        `${BASE_URL}/timeseries`,
        {
          params: {
            access_key: MARKETSTACK_API_KEY,
            symbols: symbol,
            date_from: lastWeek.toISOString().split('T')[0],
            date_to: today.toISOString().split('T')[0],
            interval: 'daily'
          },
        }
      );

      const latestData = response.data.data[0];
      
      return {
        ticker: symbol,
        close: latestData.close,
        high: latestData.high,
        low: latestData.low,
        open: latestData.open,
        volume: latestData.volume,
        vwap: (latestData.high + latestData.low) / 2, // Approximate VWAP
        timestamp: new Date(latestData.date).getTime(),
      };
    });

    return Promise.all(promises);
  }
} 