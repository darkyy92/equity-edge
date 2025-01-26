import { AIAnalysisResponse, StockRecommendation } from './types';
import { supabase } from "@/integrations/supabase/client";

export const getAIAnalysis = async (symbol: string, stockData: any): Promise<AIAnalysisResponse> => {
  try {
    const { data: { generatedAnalysis }, error } = await supabase.functions.invoke(
      'analyze-with-perplexity',
      {
        body: JSON.stringify({
          symbol,
          stockData
        })
      }
    );

    if (error) throw error;

    return generatedAnalysis;
  } catch (error) {
    console.error('Error getting Perplexity analysis:', error);
    return {
      strategy: "Analysis temporarily unavailable. Please try again later.",
      technical: "Technical analysis unavailable.",
      market: "Market analysis unavailable.",
      risks: "Risk analysis unavailable."
    };
  }
};

export const getStockRecommendations = async (timeframe: string): Promise<StockRecommendation[]> => {
  try {
    const { data: { recommendations }, error } = await supabase.functions.invoke(
      'get-stock-recommendations-perplexity',
      {
        body: JSON.stringify({ timeframe })
      }
    );

    if (error) throw error;
    return recommendations;
  } catch (error) {
    console.error('Error getting stock recommendations:', error);
    throw error;
  }
};