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
        // Wait 1 second between requests to respect rate limits
        await wait(1000);
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
    }
  }
  isProcessingQueue = false;
};

const makeOpenAIRequest = async (messages: any[]) => {
  const maxRetries = 3;
  let retryCount = 0;
  let baseDelay = 1000; // 1 second

  while (retryCount < maxRetries) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          // Rate limit exceeded, wait and retry
          const delay = baseDelay * Math.pow(2, retryCount);
          await wait(delay);
          retryCount++;
          continue;
        }
        
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      return await response.json();
    } catch (error) {
      if (retryCount === maxRetries - 1) {
        throw error;
      }
      retryCount++;
      await wait(baseDelay * Math.pow(2, retryCount));
    }
  }
};

export const getAIAnalysis = async (symbol: string, stockData: any): Promise<AIAnalysisResponse | null> => {
  try {
    return new Promise((resolve, reject) => {
      const request = async () => {
        try {
          const messages = [
            {
              role: 'system',
              content: 'You are a financial analyst. Provide a comprehensive analysis of the stock based on the provided data. Include investment strategy, technical analysis, market analysis, and risk factors.',
            },
            {
              role: 'user',
              content: `Analyze this stock data for ${symbol}: ${JSON.stringify(stockData)}`,
            },
          ];

          const data = await makeOpenAIRequest(messages);
          const analysis = data.choices[0].message.content;

          // Parse the analysis into sections
          const sections: AIAnalysisResponse = {
            strategy: extractSection(analysis, "Investment Strategy"),
            technical: extractSection(analysis, "Technical Analysis"),
            market: extractSection(analysis, "Market Analysis"),
            risks: extractSection(analysis, "Risk Factors"),
          };

          resolve(sections);
        } catch (error) {
          console.error('Error getting AI analysis:', error);
          reject(error);
        }
      };

      requestQueue.push(request);
      processQueue();
    });
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    return null;
  }
};

const extractSection = (text: string, section: string): string => {
  const regex = new RegExp(`${section}:?([^]*?)(?=(?:Investment Strategy|Technical Analysis|Market Analysis|Risk Factors):|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `${section} information not available.`;
};
