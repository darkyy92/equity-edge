import { StockTicker } from "../types";
import { getAIRecommendations } from "./ai-recommendations";
import { enrichStockData } from "./polygon";

export const getTopStocks = async (timeframe: 'short' | 'medium' | 'long'): Promise<StockTicker[]> => {
  try {
    // Get AI recommendations
    const recommendations = await getAIRecommendations(timeframe);
    if (!recommendations.length) return [];

    // Enrich with Polygon data
    const symbols = recommendations.map(rec => rec.symbol);
    const enrichedData = await enrichStockData(symbols);

    // Combine AI recommendations with market data
    return recommendations.map(rec => {
      const marketData = enrichedData.find(data => data.ticker === rec.symbol);
      return {
        ...rec,
        ...marketData
      };
    });
  } catch (error) {
    console.error('Error in getTopStocks:', error);
    throw error;
  }
};

export * from './polygon';
export * from './ai-recommendations';