const OPENAI_API_KEY = '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';

export const getAIAnalysis = async (symbol: string, stockData: any) => {
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
            content: 'You are a financial analyst. Provide a comprehensive analysis of the stock based on the provided data. Include investment strategy, technical analysis, market analysis, and risk factors.',
          },
          {
            role: 'user',
            content: `Analyze this stock data for ${symbol}: ${JSON.stringify(stockData)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the analysis into sections
    const sections = {
      strategy: extractSection(analysis, "Investment Strategy"),
      technical: extractSection(analysis, "Technical Analysis"),
      market: extractSection(analysis, "Market Analysis"),
      risks: extractSection(analysis, "Risk Factors"),
    };

    return sections;
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