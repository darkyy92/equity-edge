export class MarketStackService {
  static async getStockData(symbols: string[]) {
    try {
      console.log('Fetching data from MarketStack for symbols:', symbols.join(','));
      
      // First try intraday endpoint
      const intradayResponse = await fetch(`https://api.marketstack.com/v2/intraday/latest?access_key=${process.env.VITE_MARKETSTACK_API_KEY}&symbols=${symbols.join(',')}`);
      
      if (!intradayResponse.ok) {
        throw new Error('MarketStack intraday API request failed');
      }
      
      const intradayData = await intradayResponse.json();
      console.log('MarketStack Intraday API response:', intradayData);

      // If no data from intraday, try EOD endpoint
      if (!intradayData.data || intradayData.data.length === 0) {
        console.log('No intraday data available, trying EOD endpoint');
        const eodResponse = await fetch(`https://api.marketstack.com/v2/eod/latest?access_key=${process.env.VITE_MARKETSTACK_API_KEY}&symbols=${symbols.join(',')}`);
        
        if (!eodResponse.ok) {
          throw new Error('MarketStack EOD API request failed');
        }
        
        const eodData = await eodResponse.json();
        console.log('MarketStack EOD API response:', eodData);
        intradayData.data = eodData.data || [];
      }

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
      intradayData.data.forEach((stock: any) => {
        if (stock.symbol) {
          const symbol = stock.symbol.toUpperCase();
          stocksMap[symbol] = {
            symbol,
            price: stock.close || stock.last || 0,
            change: (stock.close || stock.last || 0) - (stock.open || 0),
            changePercent: ((stock.close || stock.last || 0) - (stock.open || 0)) / (stock.open || 1) * 100,
            volume: stock.volume || 0,
            vwap: stock.vwap || stock.mid || 0
          };
        }
      });

      // For any remaining symbols with null prices, try to fetch them individually
      const nullPriceSymbols = Object.values(stocksMap).filter(stock => !stock.price);
      if (nullPriceSymbols.length > 0) {
        console.log('Fetching individual data for symbols:', nullPriceSymbols.map(s => s.symbol));
        await Promise.all(nullPriceSymbols.map(async (stock) => {
          try {
            const response = await fetch(`https://api.marketstack.com/v2/tickers/${stock.symbol}/eod/latest?access_key=${process.env.VITE_MARKETSTACK_API_KEY}`);
            if (response.ok) {
              const data = await response.json();
              if (data.data && data.data.length > 0) {
                const latestData = data.data[0];
                stocksMap[stock.symbol] = {
                  symbol: stock.symbol,
                  price: latestData.close || latestData.last || 0,
                  change: (latestData.close || latestData.last || 0) - (latestData.open || 0),
                  changePercent: ((latestData.close || latestData.last || 0) - (latestData.open || 0)) / (latestData.open || 1) * 100,
                  volume: latestData.volume || 0,
                  vwap: latestData.vwap || latestData.mid || 0
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching individual data for ${stock.symbol}:`, error);
          }
        }));
      }

      // Convert map back to array
      const transformedData = Object.values(stocksMap);
      console.log('Final market data:', transformedData);
      
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