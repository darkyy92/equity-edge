import { toast } from "@/components/ui/use-toast";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface OpenAIResponse {
  strategy?: string;
  technical?: string;
  market?: string;
  risks?: string;
}

const requestQueue: (() => Promise<any>)[] = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  try {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      await nextRequest();
    }
  } catch (error) {
    console.error('Error processing request:', error);
  } finally {
    isProcessing = false;
    if (requestQueue.length > 0) {
      processQueue();
    }
  }
};

const makeOpenAIRequest = async (messages: any[]): Promise<any> => {
  if (!OPENAI_API_KEY) {
    toast({
      title: "API Key Missing",
      description: "OpenAI API key is not configured",
      variant: "destructive",
    });
    throw new Error("OpenAI API key is not configured");
  }

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
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI analysis');
    }

    return response.json();
  } catch (error) {
    console.error('OpenAI API error:', error);
    toast({
      title: "Analysis Error",
      description: "Failed to generate AI analysis. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

const request = async (messages: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await makeOpenAIRequest(messages);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

export const getAIAnalysis = async (symbol: string, priceData: any): Promise<OpenAIResponse | null> => {
  const messages = [
    {
      role: 'system',
      content: 'You are a financial analyst providing detailed stock analysis.',
    },
    {
      role: 'user',
      content: `Analyze ${symbol} stock. Current price: $${priceData?.c.toFixed(2)}. Change: ${(priceData?.c - priceData?.o).toFixed(2)} (${((priceData?.c - priceData?.o) / priceData?.o * 100).toFixed(2)}%).`,
    },
  ];

  try {
    const response = await request(messages);
    return {
      strategy: response.choices[0].message.content,
      technical: response.choices[1]?.message.content,
      market: response.choices[2]?.message.content,
      risks: response.choices[3]?.message.content,
    };
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    return null;
  }
};