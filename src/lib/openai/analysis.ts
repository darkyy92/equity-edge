import { AIAnalysisResponse, OpenAIMessage } from './types';
import { makeOpenAIRequest } from './api';
import { addToQueue } from './queue';
import { toast } from '@/components/ui/use-toast';

const getFallbackAnalysis = (symbol: string): AIAnalysisResponse => ({
  strategy: "AI analysis temporarily unavailable. Please try again later.",
  technical: "Technical analysis unavailable due to API limitations.",
  market: "Market analysis unavailable due to API limitations.",
  risks: "Risk analysis unavailable due to API limitations."
});

export const getAIAnalysis = async (symbol: string, stockData: any): Promise<AIAnalysisResponse> => {
  return new Promise((resolve) => {
    const request = async () => {
      try {
        const messages: OpenAIMessage[] = [
          {
            role: 'system',
            content: 'You are a financial analyst. Provide a very concise 1-2 sentence analysis of the stock. Focus only on the most important aspect.',
          },
          {
            role: 'user',
            content: `Analyze this stock data for ${symbol}: ${JSON.stringify(stockData)}`,
          },
        ];

        const data = await makeOpenAIRequest(messages);
        const analysis = data.choices[0].message.content;

        const sections: AIAnalysisResponse = {
          strategy: analysis,
          technical: "",
          market: "",
          risks: "",
        };

        resolve(sections);
      } catch (error) {
        console.error('Error getting AI analysis:', error);
        toast({
          title: "AI Analysis Error",
          description: error instanceof Error ? error.message : "Failed to get AI analysis. Please try again later.",
          variant: "destructive",
        });
        resolve(getFallbackAnalysis(symbol));
      }
    };

    addToQueue(request);
  });
};