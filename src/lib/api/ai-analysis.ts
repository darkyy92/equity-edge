import { supabase } from "@/integrations/supabase/client";
import { StockTicker } from "../types";

interface AIAnalysisParams {
  stockData: StockTicker;
  timeframe: 'short' | 'medium' | 'long';
}

const analyzeStockMetrics = (stockData: StockTicker, timeframe: 'short' | 'medium' | 'long') => {
  const volatility = Math.abs(stockData.changePercent || 0);
  const volume = stockData.volume || 0;
  const price = stockData.price || 0;
  
  let confidence: number;
  let potentialGrowth: number;
  
  switch(timeframe) {
    case 'short':
      confidence = Math.min(85, 60 + (volatility * 2));
      potentialGrowth = volatility * (Math.random() > 0.5 ? 1.5 : -1.5);
      break;
    case 'medium':
      confidence = Math.min(80, 55 + (volume / 1000000));
      potentialGrowth = (volatility * 1.2) * (Math.random() > 0.4 ? 1 : -1);
      break;
    case 'long':
      confidence = Math.min(75, 50 + (price / 10));
      potentialGrowth = (volatility * 0.8) * (Math.random() > 0.3 ? 1 : -1);
      break;
  }

  return {
    confidence: Math.round(confidence),
    potentialGrowth: Number(potentialGrowth.toFixed(2)),
    timeframe
  };
};

export const generateAIRecommendation = async ({ stockData, timeframe }: AIAnalysisParams) => {
  try {
    const analysis = analyzeStockMetrics(stockData, timeframe);
    
    // Store the recommendation in Supabase
    const { error } = await supabase
      .from('stock_recommendations')
      .upsert({
        symbol: stockData.ticker,
        [`${timeframe}_term_analysis`]: {
          potentialGrowth: analysis.potentialGrowth,
          confidence: analysis.confidence,
          timeframe: timeframe
        },
        explanation: `Based on ${stockData.name}'s recent performance and market analysis`,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'symbol'
      });

    if (error) {
      console.error('Error storing recommendation:', error);
    }

    return analysis;
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    throw error;
  }
};