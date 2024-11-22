import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface LastUpdatedProps {
  timestamp: number;
}

const LastUpdated = ({ timestamp }: LastUpdatedProps) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) {
        setTimeAgo(`${seconds} seconds ago`);
      } else if (seconds < 3600) {
        setTimeAgo(`${Math.floor(seconds / 60)} minutes ago`);
      } else {
        setTimeAgo(`${Math.floor(seconds / 3600)} hours ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <Badge variant="outline" className="ml-2">
      Updated {timeAgo}
    </Badge>
  );
};

export default LastUpdated;