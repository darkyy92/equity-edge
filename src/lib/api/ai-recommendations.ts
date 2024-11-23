import { AIRecommendation, StockTicker } from "../types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OPENAI_API_KEY = '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';

export const getAIRecommendations = async (timeframe: 'short' | 'medium' | 'long'): Promise<StockTicker[]> => {
  try {
    const { data: existingRecommendations, error: dbError } = await supabase
      .from('stock_recommendations')
      .select('*')
      .eq('strategy_type', timeframe)
      .order('created_at', { ascending: false })
      .limit(9);

    if (dbError) throw dbError;

    // If we have recent recommendations (less than 1 hour old), use them
    if (existingRecommendations && existingRecommendations.length > 0) {
      const mostRecent = new Date(existingRecommendations[0].created_at);
      if (Date.now() - mostRecent.getTime() < 60 * 60 * 1000) {
        return existingRecommendations;
      }
    }

    // Otherwise, get new recommendations from OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst. Recommend 9 stocks for ${timeframe}-term investment. Return a JSON array with objects containing: symbol, reason, confidence, potentialGrowth.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    // Store recommendations in database
    const { error: insertError } = await supabase
      .from('stock_recommendations')
      .insert(
        recommendations.map((rec: any) => ({
          symbol: rec.symbol,
          strategy_type: timeframe,
          explanation: rec.reason,
          confidence_metrics: { confidence: rec.confidence },
          [`${timeframe}_term_analysis`]: {
            potentialGrowth: rec.potentialGrowth,
            timeframe
          }
        }))
      );

    if (insertError) throw insertError;

    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch AI recommendations. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};
