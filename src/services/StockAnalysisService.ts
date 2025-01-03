import { getAIAnalysis } from '@/lib/openai';

export class StockAnalysisService {
  static async analyzeStocks(stocksData: any[]) {
    try {
      const recommendations = await Promise.all(
        stocksData.map(async (stock) => {
          const analysis = await getAIAnalysis(stock.symbol, stock);
          
          return {
            ticker: stock.symbol,
            recommendation: analysis.strategy.includes('buy') ? 'Buy' : 
                          analysis.strategy.includes('sell') ? 'Sell' : 'Hold',
            confidence: Math.floor(Math.random() * 20) + 80, // Temporary until AI provides confidence
            reasoning: analysis.strategy
          };
        })
      );

      console.log('AI Analysis Results:', recommendations);
      return recommendations;
    } catch (error) {
      console.error('Error analyzing stocks:', error);
      return stocksData.map(stock => ({
        ticker: stock.symbol,
        recommendation: 'Hold',
        confidence: 75,
        reasoning: 'Analysis temporarily unavailable'
      }));
    }
  }
}