
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

// Define all days of the week
const ALL_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thr", "Fri"];

interface DaySelectorProps {
  activeDays: string[];
  selectedDays: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  activeDays,
  selectedDays,
  onChange,
  error,
}) => {
  const handleDaySelection = (values: string[]) => {
    const validSelections = values.filter((day) => activeDays.includes(day));
    onChange(validSelections);
  };

  return (
    <div>
      <h3 className="mb-3 text-gray-600 text-md">
        Select Days <span className="text-red-500">*</span>
      </h3>
      <ToggleGroup
        type="multiple"
        value={selectedDays}
        onValueChange={handleDaySelection}
        className="flex flex-wrap gap-2 justify-start"
      >
        {ALL_DAYS.map((day) => {
          const isActive = activeDays.includes(day);
          return (
            <ToggleGroupItem
              key={day}
              value={day}
              aria-label={day}
              disabled={!isActive}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "border-2 border-gray-200 hover:bg-blue-50",
                "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600",
                !isActive && "opacity-70 cursor-not-allowed"
              )}
            >
              {day}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DaySelector;
