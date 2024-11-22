import { Link, useLocation } from "react-router-dom";
import { HomeIcon, LineChartIcon } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isStockPage = location.pathname.includes('/stock/');
  const stockSymbol = isStockPage ? location.pathname.split('/').pop() : '';

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <LineChartIcon className="h-6 w-6" />
            <span className="font-bold">Market Pulse</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 ${!isStockPage ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {isStockPage && (
            <div className="flex items-center space-x-2 text-foreground">
              <LineChartIcon className="h-4 w-4" />
              <span>{stockSymbol} Analysis</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;