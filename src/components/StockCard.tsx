import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockCard = ({ symbol, name, price, change, changePercent }: StockCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="glass-card p-6 hover-scale">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{symbol}</p>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        {isPositive ? (
          <ArrowUpIcon className="text-success" />
        ) : (
          <ArrowDownIcon className="text-error" />
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">${price.toFixed(2)}</p>
        <div className={`flex items-center space-x-2 ${isPositive ? 'text-success' : 'text-error'}`}>
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StockCard;