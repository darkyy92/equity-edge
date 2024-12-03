import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import StockAnalysis from "./pages/StockAnalysis";

// Configure QueryClient with global defaults for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // Data considered fresh for 15 minutes
      gcTime: 30 * 60 * 1000,    // Keep unused data in cache for 30 minutes
      refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false,       // Don't refetch on component mount if data is fresh
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stock/:symbol" element={<StockAnalysis />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;