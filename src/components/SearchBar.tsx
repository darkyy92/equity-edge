import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['stockSearch', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const handleStockClick = (symbol: string) => {
    setQuery("");
    setIsResultsVisible(false);
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10 bg-background/50 border-border/50"
          placeholder="Search stocks by name or symbol..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsResultsVisible(true);
          }}
          onFocus={() => setIsResultsVisible(true)}
        />
      </div>

      {isResultsVisible && query && (
        <Card className="absolute z-50 w-full mt-2 p-2 max-h-[300px] overflow-y-auto bg-background/95 backdrop-blur-lg border-border/50">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2Icon className="animate-spin h-4 w-4" />
            </div>
          ) : searchResults?.length ? (
            <div className="space-y-2">
              {searchResults.map((stock) => (
                <div
                  key={stock.ticker}
                  className="p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleStockClick(stock.ticker)}
                >
                  <div className="font-medium">{stock.ticker}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchBar;