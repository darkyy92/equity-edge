import LastUpdated from "@/components/LastUpdated";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

interface StockHeaderProps {
  symbol: string;
  priceData?: {
    c: number;
    o: number;
  };
  dataUpdatedAt?: number;
}

const StockHeader = ({ symbol, priceData, dataUpdatedAt }: StockHeaderProps) => {
  if (!priceData) return null;
  
  const change = priceData.c - priceData.o;
  const changePercent = (change / priceData.o) * 100;
  const isPositive = change >= 0;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">{symbol}</h1>
          {dataUpdatedAt && <LastUpdated timestamp={dataUpdatedAt} />}
        </div>
        <p className="text-2xl font-semibold">
          ${priceData.c.toFixed(2)}
          <span className={`ml-2 text-lg ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        </p>
      </div>
      {isPositive ? (
        <TrendingUpIcon className="w-8 h-8 text-success" />
      ) : (
        <TrendingDownIcon className="w-8 h-8 text-error" />
      )}
    </div>
  );
};

export default StockHeader;