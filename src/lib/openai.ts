const OPENAI_API_KEY = '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';

export const getAIRecommendation = async (stockData: any) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst. Provide a brief analysis of the stock based on the provided data.',
          },
          {
            role: 'user',
            content: `Analyze this stock data and provide a recommendation: ${JSON.stringify(stockData)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    return 'Unable to generate AI recommendation at this time.';
  }
};