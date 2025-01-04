import { Card } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";

export const EmptyRecommendations = () => (
  <Card className="p-8 text-center bg-background/95 backdrop-blur-lg border-border/50">
    <TrendingUpIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
    <p className="text-lg font-medium">No recommendations available</p>
    <p className="text-muted-foreground">Check back later for updated analysis!</p>
  </Card>
);