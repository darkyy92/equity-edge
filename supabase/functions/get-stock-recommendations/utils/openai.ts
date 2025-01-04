import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface StockRecommendation {
  symbol: string;
  name: string;  
  reason: string;
  confidence: number;
  potentialGrowth: number;
  primaryDrivers: string[];
}

export const getAIRecommendations = async (timeframe: string): Promise<StockRecommendation[]> => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    console.log('[OpenAI] Fetching AI recommendations for timeframe:', timeframe);
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst specializing in diverse stock recommendations. Your task is to provide a balanced mix of stock recommendations:

            - 2 well-established, large-cap companies (market leaders)
            - 2 mid-cap companies with solid growth potential (emerging players)
            - 2 small-cap or lesser-known companies with significant upside potential (underdogs)

            For each recommendation, include:
            - The stock symbol
            - The full legal company name (VERY IMPORTANT)
            - Current market position and growth trajectory
            - Competitive advantages
            - Industry trends and market opportunities
            - Risk factors and potential catalysts
            
            Ensure recommendations are based on fundamental analysis and growth potential.`
          },
          {
            role: 'user',
            content: `Return a raw JSON array of 6 diverse stock recommendations for ${timeframe} investment opportunities, following the balanced distribution described. Each object must have exactly these fields and types:
            {
              "symbol": string (stock ticker),
              "name": string (full legal company name),
              "reason": string (2-3 sentences explaining why),
              "confidence": number (0-100),
              "potentialGrowth": number (expected percentage growth),
              "primaryDrivers": string[] (3-4 key factors)
            }
            Return ONLY the raw JSON array with no markdown formatting or additional text.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[OpenAI] API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('[OpenAI] Received response:', JSON.stringify(aiData, null, 2));

    if (!aiData.choices?.[0]?.message?.content) {
      console.error('[OpenAI] Invalid response format:', aiData);
      throw new Error('Invalid AI response format');
    }

    const content = aiData.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    console.log('[OpenAI] Cleaned content:', content);
    const recommendations = JSON.parse(content);
    
    if (!Array.isArray(recommendations)) {
      console.error('[OpenAI] Response is not an array:', recommendations);
      throw new Error('Response is not an array');
    }

    // Validate each recommendation has required fields
    recommendations.forEach((rec, index) => {
      console.log(`[OpenAI] Recommendation ${index + 1}:`, {
        symbol: rec.symbol,
        name: rec.name,
        confidence: rec.confidence,
        potentialGrowth: rec.potentialGrowth
      });
      
      if (!rec.name || typeof rec.name !== 'string') {
        console.error(`[OpenAI] Missing or invalid name for symbol ${rec.symbol}`);
        rec.name = rec.symbol; // Fallback to symbol if name is missing
      }
    });

    return recommendations;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[OpenAI] Request timeout');
      throw new Error('Request timeout');
    }
    console.error('[OpenAI] Error:', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};