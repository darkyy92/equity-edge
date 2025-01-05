import { Link, useLocation } from "react-router-dom";
import { BarChart2Icon, Settings2Icon, StarIcon, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-black/20 backdrop-blur-md border-r border-white/10 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <img src="/lovable-uploads/c61bb094-f3cc-417b-8cbe-ccb9ad907c73.png" alt="Logo" className="w-8 h-8" />
        <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Equity Edge
        </span>
      </div>

      <div className="mb-6 px-1">
        <SearchBar />
      </div>

      <div className="space-y-2">
        <Link to="/">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 ${location.pathname === '/' ? 'bg-white/10 text-white' : ''}`}
          >
            <BarChart2Icon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link to="/analysis">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 ${location.pathname === '/analysis' ? 'bg-white/10 text-white' : ''}`}
          >
            <StarIcon className="mr-2 h-4 w-4" />
            Analysis
          </Button>
        </Link>

        <Link to="/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 ${location.pathname === '/settings' ? 'bg-white/10 text-white' : ''}`}
          >
            <Settings2Icon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-white/40 mb-2">Favorites</h3>
        <div className="space-y-1">
          {['AAPL', 'MSFT', 'GOOGL', 'TSLA'].map((symbol) => (
            <Link key={symbol} to={`/stock/${symbol}`}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-white/70 hover:text-white hover:bg-white/10"
              >
                <StarIcon className="mr-2 h-3 w-3 text-purple-400" />
                {symbol}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">John Smith</span>
            <span className="text-xs text-white/40">john@example.com</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/10">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;