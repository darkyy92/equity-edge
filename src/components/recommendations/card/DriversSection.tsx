import { Badge } from "@/components/ui/badge";

interface DriversSectionProps {
  primaryDrivers: string[];
}

export const DriversSection = ({ primaryDrivers }: DriversSectionProps) => {
  const driversToDisplay = primaryDrivers || [];

  if (driversToDisplay.length === 0) {
    return null; // Don't render if no drivers
  }

  return (
    // Stack badges vertically with gap
    <div className="flex flex-col gap-2 mb-4 items-start">
      {driversToDisplay.map((driver, index) => (
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
};