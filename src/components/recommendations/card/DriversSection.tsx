import { Badge } from "@/components/ui/badge";

interface DriversSectionProps {
  primaryDrivers: string[];
}

export const DriversSection = ({ primaryDrivers }: DriversSectionProps) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {primaryDrivers.map((driver, index) => (
      <Badge 
        key={index} 
        variant="outline" 
        className="bg-accent/50 text-foreground border-accent"
      >
        {driver}
      </Badge>
    ))}
  </div>
);