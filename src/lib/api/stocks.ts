import { fetchTopStocks } from './polygon';
import { generateAIRecommendation } from './ai-analysis';
import { StockTicker } from '../types';

export const getTopStocks = async (timeframe: 'short' | 'medium' | 'long'): Promise<StockTicker[]> => {
  try {
    // Fetch top gainers for short-term, highest volume for medium-term, and largest market cap for long-term
    const endpoint = timeframe === 'short' 
      ? 'gainers'
      : timeframe === 'medium' 
        ? 'most-active' 
        : 'market-cap';
        
    const stocks = await fetchTopStocks(endpoint);
    
    // Process stocks based on timeframe strategy
    const processedStocks = await Promise.all(
      stocks.map(async (stock: StockTicker) => {
        const aiRecommendation = await generateAIRecommendation({
          stockData: stock,
          timeframe
        });
        
        return {
          ...stock,
          aiRecommendation
        };
      })
    );
    
    // Sort based on the timeframe strategy
    return processedStocks.sort((a, b) => {
      if (timeframe === 'short') {
        return Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0);
      }
      if (timeframe === 'medium') {
        return (b.volume || 0) - (a.volume || 0);
      }
      return (b.price || 0) - (a.price || 0);
    }).slice(0, 6);
  } catch (error) {
    console.error('Error in getTopStocks:', error);
    throw error;
  }
};

export * from './polygon';