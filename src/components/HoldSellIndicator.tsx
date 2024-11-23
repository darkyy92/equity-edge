import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface HoldSellIndicatorProps {
  recommendation: string;
  strength: string;
  explanation: string;
}

const isValidRecommendation = (value: string): value is 'hold' | 'sell' | 'review' => {
  return ['hold', 'sell', 'review'].includes(value.toLowerCase());
};

const isValidStrength = (value: string): value is 'green' | 'yellow' | 'red' => {
  return ['green', 'yellow', 'red'].includes(value.toLowerCase());
};

const HoldSellIndicator = ({ recommendation, strength, explanation }: HoldSellIndicatorProps) => {
  const normalizedRecommendation = isValidRecommendation(recommendation) ? recommendation.toLowerCase() as 'hold' | 'sell' | 'review' : 'review';
  const normalizedStrength = isValidStrength(strength) ? strength.toLowerCase() as 'green' | 'yellow' | 'red' : 'yellow';

  const getIndicatorColor = () => {
    switch (normalizedStrength) {
      case 'green':
        return 'text-success bg-success/10';
      case 'yellow':
        return 'text-warning bg-warning/10';
      case 'red':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getIcon = () => {
    switch (normalizedStrength) {
      case 'green':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'yellow':
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case 'red':
        return <AlertCircle className="w-6 h-6 text-error" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Position Recommendation</h3>
        <Badge variant="outline" className={getIndicatorColor()}>
          {normalizedRecommendation.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-start space-x-4">
        {getIcon()}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      </div>
    </Card>
  );
};

export default HoldSellIndicator;