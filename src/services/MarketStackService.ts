export class MarketStackService {
  static async getStockData(symbols: string[]) {
    try {
      console.log('Fetching data from MarketStack for symbols:', symbols.join(','));
      
      const response = await fetch(`https://api.marketstack.com/v2/intraday/latest?access_key=${process.env.VITE_MARKETSTACK_API_KEY}&symbols=${symbols.join(',')}`);
      
      if (!response.ok) {
        throw new Error('MarketStack API request failed');
      }
      
      const data = await response.json();
      console.log('MarketStack API response:', data);

      // Create a map of all requested symbols with default values
      const stocksMap = symbols.reduce((acc, symbol) => {
        acc[symbol] = {
          symbol,
          price: null,
          change: null,
          changePercent: null,
          volume: null,
          vwap: null
        };
        return acc;
      }, {});

      // Update the map with actual data for stocks that were returned
      data.data.forEach((stock: any) => {
        if (stock.symbol) {
          stocksMap[stock.symbol] = {
            symbol: stock.symbol,
            price: stock.close || stock.last || 0,
            change: (stock.close || stock.last || 0) - (stock.open || 0),
            changePercent: ((stock.close || stock.last || 0) - (stock.open || 0)) / (stock.open || 1) * 100,
            volume: stock.volume || 0,
            vwap: stock.mid || 0
          };
        }
      });

      // Convert map back to array
      const transformedData = Object.values(stocksMap);
      console.log('Received market data:', transformedData);
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Return default data for all requested symbols
      return symbols.map(symbol => ({
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        vwap: 0
      }));
    }
  }
}