interface DriversSectionProps {
  primaryDrivers: string[];
}

import { CheckIcon } from 'lucide-react';

export const DriversSection = ({ primaryDrivers }: DriversSectionProps) => {
  const driversToDisplay = primaryDrivers || [];

  if (driversToDisplay.length === 0) {
    return null; // Don't render if no drivers
  }

  return (
    <div className="mb-4">
      <ul className="list-none p-0 m-0 space-y-2"> {/* Changed to unordered list, removed default styling and added space between items */}
        {driversToDisplay.map((driver, index) => (
          <li
            key={index}
            className="flex items-start text-sm text-white/80"
          >
            <CheckIcon className="flex-shrink-0 h-4 w-4 text-white mr-2 mt-0.5" /> {/* Changed checkmark icon color to white */}
            <span>{driver}</span> {/* Wrapped driver text in a span for better control */}
          </li>
        ))}
      </ul>
    </div>
  );
};