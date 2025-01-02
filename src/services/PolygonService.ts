import axios from 'axios';

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

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

export class PolygonService {
  static async getStockData(symbols: string[]): Promise<StockData[]> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const promises = symbols.map(async (symbol) => {
      const response = await axios.get(
        `${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${lastWeek.toISOString().split('T')[0]}/${today.toISOString().split('T')[0]}`,
        {
          params: {
            apiKey: POLYGON_API_KEY,
          },
        }
      );

      const latestData = response.data.results[response.data.results.length - 1];
      
      return {
        ticker: symbol,
        close: latestData.c,
        high: latestData.h,
        low: latestData.l,
        open: latestData.o,
        volume: latestData.v,
        vwap: latestData.vw,
        timestamp: latestData.t,
      };
    });

    return Promise.all(promises);
  }
} 