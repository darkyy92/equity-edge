import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AIAnalysisResponse } from "@/lib/openai";

interface AIAnalysisCardProps {
  aiAnalysis: AIAnalysisResponse | null;
  isLoading: boolean;
}

const AIAnalysisCard = ({ aiAnalysis, isLoading }: AIAnalysisCardProps) => {
  return (
    <Card className={cn(
      "p-6 relative overflow-hidden",
      isLoading && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400 before:via-pink-500 before:to-red-500 before:animate-pulse before:opacity-20"
    )}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">AI Analysis</h2>
          <Badge variant="outline" className="mb-2">AI Generated</Badge>
        </div>
        {isLoading ? (
          <div>
            <p className="text-muted-foreground mb-4">Generating AI analysis, please wait...</p>
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.strategy || '' }} />
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.technical || '' }} />
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.market || '' }} />
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis?.risks || '' }} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIAnalysisCard;