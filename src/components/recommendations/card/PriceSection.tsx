interface PriceSectionProps {
  price: number;
  changePercent: number;
}

export const PriceSection = ({ price, changePercent }: PriceSectionProps) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <p className="text-sm text-muted-foreground mb-1">Current Price</p>
      <p className="text-lg font-semibold">${price.toFixed(2)}</p>
    </div>
    <div>
      <p className="text-sm text-muted-foreground mb-1">Change</p>
      <p className={`text-lg font-semibold ${changePercent >= 0 ? 'text-success' : 'text-error'}`}>
        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
      </p>
    </div>
  </div>
);