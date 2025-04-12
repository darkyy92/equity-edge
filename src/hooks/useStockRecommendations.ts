
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { StockTicker } from "@/lib/types/stock";
import { RecommendationService } from "@/services/RecommendationService";

type TimeFrame = "short-term" | "medium-term" | "long-term";

export const useStockRecommendations = (timeframe: TimeFrame) => {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', timeframe],
    queryFn: async () => {
      console.log('Fetching recommendations for timeframe:', timeframe);
      
      try {
        // Get recommendations from Supabase
        const supabaseRecommendations = await RecommendationService.getStockRecommendations(timeframe);
        
        console.log('Supabase recommendations:', supabaseRecommendations);
        
        // Convert to StockTicker format
        return supabaseRecommendations.map(rec => 
          RecommendationService.convertToStockTicker(rec)
        );

      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (error) {
    console.error('Error in useStockRecommendations:', error);
    toast({
      title: "Error loading recommendations",
      description: "Unable to fetch stock recommendations. Please try again later.",
      variant: "destructive",
    });
  }

  return { recommendations, isLoading, error };
};
