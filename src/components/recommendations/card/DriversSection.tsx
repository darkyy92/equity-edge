interface DriversSectionProps {
  primaryDrivers: string[];
}

export const DriversSection = ({ primaryDrivers }: DriversSectionProps) => {
  const driversToDisplay = primaryDrivers || [];

  if (driversToDisplay.length === 0) {
    return null; // Don't render if no drivers
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2">
        {driversToDisplay.map((driver, index) => (
          <span
            key={index}
            className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/30 font-medium w-fit"
          >
            {driver}
          </span>
        ))}
      </div>
    </div>
  );
};