import OpenAI from 'openai';
import { StockData } from './MarketStackService';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export interface StockRecommendation {
  ticker: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
}

export class StockAnalysisService {
  static async analyzeStocks(stocksData: StockData[]): Promise<StockRecommendation[]> {
    const prompt = `Analyze the following stock data and provide investment recommendations:
      ${JSON.stringify(stocksData, null, 2)}
      
      For each stock, provide:
      1. A buy/hold/sell recommendation
      2. Confidence level (0-100)
      3. Brief reasoning for the recommendation
      
      Format the response as JSON array with objects containing: ticker, recommendation, confidence, reasoning`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response.recommendations;
  }
}