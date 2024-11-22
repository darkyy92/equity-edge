const OPENAI_API_KEY = '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';

// Queue to manage API requests
let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

export interface AIAnalysisResponse {
  strategy: string;
  technical: string;
  market: string;
  risks: string;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
        await wait(2000); // Increased wait time between requests
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
    }
  }
  isProcessingQueue = false;
};

const getFallbackAnalysis = (symbol: string): AIAnalysisResponse => ({
  strategy: "AI analysis temporarily unavailable. Please try again later.",
  technical: "Technical analysis unavailable due to API limitations.",
  market: "Market analysis unavailable due to API limitations.",
  risks: "Risk analysis unavailable due to API limitations."
});

const makeOpenAIRequest = async (messages: any[]) => {
  const maxRetries = 3;
  let retryCount = 0;
  let baseDelay = 2000; // Increased base delay

  while (retryCount < maxRetries) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 300, // Further reduced tokens
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          const delay = baseDelay * Math.pow(2, retryCount);
          console.log(`Rate limit exceeded, waiting ${delay}ms before retry`);
          await wait(delay);
          retryCount++;
          continue;
        }
        
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (retryCount === maxRetries - 1) {
        throw error;
      }
      retryCount++;
      await wait(baseDelay * Math.pow(2, retryCount));
    }
  }
  
  throw new Error('Max retries exceeded');
};

export const getAIAnalysis = async (symbol: string, stockData: any): Promise<AIAnalysisResponse> => {
  return new Promise((resolve) => {
    const request = async () => {
      try {
        const messages = [
          {
            role: 'system',
            content: 'You are a financial analyst. Provide a brief analysis of the stock based on the provided data. Include investment strategy, technical analysis, market analysis, and risk factors.',
          },
          {
            role: 'user',
            content: `Analyze this stock data for ${symbol}: ${JSON.stringify(stockData)}`,
          },
        ];

        const data = await makeOpenAIRequest(messages);
        const analysis = data.choices[0].message.content;

        const sections: AIAnalysisResponse = {
          strategy: extractSection(analysis, "Investment Strategy"),
          technical: extractSection(analysis, "Technical Analysis"),
          market: extractSection(analysis, "Market Analysis"),
          risks: extractSection(analysis, "Risk Factors"),
        };

        resolve(sections);
      } catch (error) {
        console.error('Error getting AI analysis:', error);
        resolve(getFallbackAnalysis(symbol));
      }
    };

    requestQueue.push(request);
    processQueue();
  });
};

const extractSection = (text: string, section: string): string => {
  const regex = new RegExp(`${section}:?([^]*?)(?=(?:Investment Strategy|Technical Analysis|Market Analysis|Risk Factors):|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `${section} information not available.`;
};