const StockCardSkeleton = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-6 w-32 bg-muted rounded"></div>
        </div>
        <div className="h-6 w-6 bg-muted rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-24 bg-muted rounded"></div>
        <div className="h-4 w-32 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default StockCardSkeleton;