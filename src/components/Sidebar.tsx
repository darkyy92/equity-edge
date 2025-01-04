import { Link, useLocation } from "react-router-dom";
import { BarChart2Icon, SearchIcon, Settings2Icon, StarIcon, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-background/95 border-r border-border p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <img src="/lovable-uploads/c61bb094-f3cc-417b-8cbe-ccb9ad907c73.png" alt="Logo" className="w-8 h-8" />
        <span className="text-lg font-semibold text-[#C6B67E]">Equity Edge</span>
      </div>

      <div className="space-y-2">
        <Link to="/">
          <Button
            variant="ghost"
            className={`w-full justify-start ${location.pathname === '/' ? 'bg-accent' : ''}`}
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            Search stocks...
          </Button>
        </Link>

        <Link to="/">
          <Button
            variant="ghost"
            className={`w-full justify-start ${location.pathname === '/' ? 'bg-accent' : ''}`}
          >
            <BarChart2Icon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link to="/analysis">
          <Button
            variant="ghost"
            className={`w-full justify-start ${location.pathname === '/analysis' ? 'bg-accent' : ''}`}
          >
            <StarIcon className="mr-2 h-4 w-4" />
            Analysis
          </Button>
        </Link>

        <Link to="/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start ${location.pathname === '/settings' ? 'bg-accent' : ''}`}
          >
            <Settings2Icon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Favorites</h3>
        <div className="space-y-1">
          {['AAPL', 'MSFT', 'GOOGL', 'TSLA'].map((symbol) => (
            <Link key={symbol} to={`/stock/${symbol}`}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
              >
                <StarIcon className="mr-2 h-3 w-3 text-[#C6B67E]" />
                {symbol}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-accent" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Smith</span>
            <span className="text-xs text-muted-foreground">john@example.com</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;