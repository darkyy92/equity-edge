import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface StockRecommendation {
  symbol: string;
  name: string;  // Added company name field
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
    console.log('Fetching AI recommendations');
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
            - The full legal company name
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
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('Received AI response');

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    const content = aiData.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    console.log('Cleaned content:', content);
    const recommendations = JSON.parse(content);
    
    if (!Array.isArray(recommendations)) {
      throw new Error('Response is not an array');
    }

    return recommendations;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};