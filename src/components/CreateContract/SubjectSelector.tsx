
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface Subject {
  id: number;
  subject: string;
}

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubjects: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubjects,
  onChange,
  error,
}) => {
  return (
    <div className="mt-5">
      <h3 className="mb-3 text-gray-600 text-md dark:text-gray-300">
        Select Subject <span className="text-red-500">*</span>
      </h3>
      <ToggleGroup
        type="multiple"
        value={selectedSubjects}
        onValueChange={onChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        {subjects?.map((subjectInfo) => (
          <ToggleGroupItem
            key={subjectInfo.id}
            value={subjectInfo.subject}
            aria-label={subjectInfo.subject}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "border-2 border-gray-200 hover:bg-blue-50",
              "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600"
            )}
          >
            {subjectInfo.subject}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SubjectSelector;
