import { OpenAIMessage, OpenAIResponse } from './types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const makeOpenAIRequest = async (messages: OpenAIMessage[]): Promise<OpenAIResponse> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
    throw new Error('OpenAI API key is not configured. Please set it in your Supabase project settings.');
  }

  const maxRetries = 3;
  let retryCount = 0;
  let baseDelay = 2000;

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
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        
        if (response.status === 429) {
          const delay = baseDelay * Math.pow(2, retryCount);
          console.log(`Rate limit exceeded, waiting ${delay}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
          continue;
        }
        
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your API key in the Supabase project settings.');
        }
        
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (retryCount === maxRetries - 1) throw error;
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, retryCount)));
    }
  }
  
  throw new Error('Max retries exceeded');
};