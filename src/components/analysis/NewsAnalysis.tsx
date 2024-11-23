import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';

interface NewsAnalysisProps {
  symbol: string;
}

const NewsAnalysis = ({ symbol }: NewsAnalysisProps) => {
  const { data: news } = useQuery({
    queryKey: ["news", symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`
      );
      const data = await response.json();
      return data.results || [];
    },
  });

  if (!news?.length) return null;

  return (
    <div className="space-y-2">
      {news.slice(0, 5).map((item: any, index: number) => (
        <div key={index} className="flex justify-between items-center">
          <span>{item.title}</span>
          <Badge variant="outline" className={item.sentiment === "positive" ? "text-success" : "text-error"}>
            {item.sentiment}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default NewsAnalysis;