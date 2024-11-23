import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "../types";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';
const BASE_URL = 'https://api.polygon.io';

export const enrichStockData = async (symbols: string[]): Promise<Partial<StockTicker>[]> => {
  try {
    const enrichedData = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const [detailsResponse, priceResponse] = await Promise.all([
            fetch(`${BASE_URL}/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`),
            fetch(`${BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`)
          ]);

          if (!detailsResponse.ok || !priceResponse.ok) {
            throw new Error(`Failed to fetch data for ${symbol}`);
          }

          const details = await detailsResponse.json();
          const price = await priceResponse.json();

          return {
            ...details.results,
            price: price.results[0].c,
            change: price.results[0].c - price.results[0].o,
            changePercent: ((price.results[0].c - price.results[0].o) / price.results[0].o) * 100,
            volume: price.results[0].v,
            vwap: price.results[0].vw,
            isin: details.results.isin || null,
            valor_number: details.results.valor_number || null
          };
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          return {
            ticker: symbol,
            error: true
          };
        }
      })
    );

    return enrichedData.filter(data => !data.error);
  } catch (error) {
    toast({
      title: "Error fetching stock data",
      description: "Unable to fetch stock details. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};