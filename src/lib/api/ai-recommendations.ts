import { AIRecommendation, StockTicker } from "../types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        // Transform database records to StockTicker format
        return existingRecommendations.map(rec => ({
          ticker: rec.symbol,
          symbol: rec.symbol,
          name: rec.symbol, // We'll enrich this later with Polygon data
          market: 'US', // Default value, will be enriched
          locale: 'us',
          primary_exchange: 'NYSE', // Default value, will be enriched
          type: 'CS',
          active: true,
          currency_name: 'USD',
          cik: '',
          composite_figi: '',
          share_class_figi: '',
          last_updated_utc: rec.updated_at,
          isin: rec.isin,
          valor_number: rec.valor_number,
          aiRecommendation: {
            timeframe,
            potentialGrowth: rec[`${timeframe}_term_analysis`]?.potentialGrowth || 0,
            confidence: rec.confidence_metrics?.confidence || 75,
            explanation: rec.explanation || '',
            fundamentalMetrics: rec.fundamental_metrics,
            technicalSignals: rec.technical_signals,
            marketContext: rec.market_context,
            primaryDrivers: rec.primary_drivers
          }
        }));
      }
    }

    // Otherwise, get new recommendations from OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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

    // Transform to StockTicker format
    return recommendations.map((rec: any) => ({
      ticker: rec.symbol,
      symbol: rec.symbol,
      name: rec.symbol, // Will be enriched later
      market: 'US',
      locale: 'us',
      primary_exchange: 'NYSE',
      type: 'CS',
      active: true,
      currency_name: 'USD',
      cik: '',
      composite_figi: '',
      share_class_figi: '',
      last_updated_utc: new Date().toISOString(),
      aiRecommendation: {
        timeframe,
        potentialGrowth: rec.potentialGrowth,
        confidence: rec.confidence,
        explanation: rec.reason,
      }
    }));
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