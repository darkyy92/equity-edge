import { MarketStackService } from '@/services/MarketStackService';
import { StockAnalysisService } from '@/services/StockAnalysisService';

export default async function Home() {
  // List of stocks to analyze
  const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];
  
  // Fetch stock data
  const stocksData = await MarketStackService.getStockData(stockSymbols);
  
  // Get AI recommendations
  const recommendations = await StockAnalysisService.analyzeStocks(stocksData);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">AI Stock Recommendations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.ticker} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold">{rec.ticker}</h2>
              <p className="text-lg font-semibold mt-2">
                Recommendation: {rec.recommendation}
              </p>
              <p className="mt-2">Confidence: {rec.confidence}%</p>
              <p className="mt-2 text-sm">{rec.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}