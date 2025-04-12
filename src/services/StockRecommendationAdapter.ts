import { Json } from "@/integrations/supabase/types";
import { StockRecommendation } from "./RecommendationService";

// This adapter helps handle differences between what the StockAnalysis page expects
// and what our database actually contains
export const StockRecommendationAdapter = {
  // Add fields that StockAnalysis.tsx expects but aren't in our database
  adaptForStockAnalysis(recommendation: StockRecommendation | any): any {
    // Parse entry zone into a range object if it exists
    let entry_range: Json = null;
    if (recommendation.entryZone) {
      try {
        // Try to parse if it's a JSON string
        if (typeof recommendation.entryZone === 'string' && 
            (recommendation.entryZone.includes('{') || recommendation.entryZone.includes('['))) {
          entry_range = JSON.parse(recommendation.entryZone);
        } else {
          // Otherwise create a range based on the string value
          const parts = String(recommendation.entryZone).split('-');
          if (parts.length === 2) {
            const lower = parseFloat(parts[0].trim());
            const upper = parseFloat(parts[1].trim());
            if (!isNaN(lower) && !isNaN(upper)) {
              entry_range = { lower, upper };
            }
          }
        }
      } catch (e) {
        console.error("Error parsing entry zone:", e);
        entry_range = recommendation.entryZone;
      }
    }

    return {
      ...recommendation,
      // Add missing fields that StockAnalysis.tsx expects
      entry_range: entry_range || recommendation.entryZone || null,
      hold_sell_recommendation: "Hold", // Default value
      recommendation_strength: recommendation.confidence ? 
        (recommendation.confidence > 7 ? "green" : recommendation.confidence > 4 ? "yellow" : "red") 
        : "yellow",
      explanation: recommendation.entryZoneExplanation || recommendation.reason || "",
    };
  }
};
