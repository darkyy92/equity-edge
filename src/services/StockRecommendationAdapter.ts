
import { Json } from "@/integrations/supabase/types";
import { StockRecommendation } from "./RecommendationService";

// This adapter helps handle differences between what the StockAnalysis page expects
// and what our database actually contains
export const StockRecommendationAdapter = {
  // Add fields that StockAnalysis.tsx expects but aren't in our database
  adaptForStockAnalysis(recommendation: StockRecommendation): any {
    return {
      ...recommendation,
      // Add missing fields that StockAnalysis.tsx expects
      entry_range: recommendation.entryZone || "N/A",
      hold_sell_recommendation: "Hold", // Default value
      recommendation_strength: recommendation.confidence,
      explanation: recommendation.entryZoneExplanation || recommendation.reason,
      // Add any other fields that StockAnalysis.tsx might expect
    };
  }
};
