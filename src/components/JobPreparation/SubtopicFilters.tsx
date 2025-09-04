
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, HelpCircle, Menu, X } from 'lucide-react';
import { Subtopic } from '@/types/jobPreparation';

interface SubtopicFiltersProps {
  subtopics: Subtopic[];
  selectedSubtopicId: string | null;
  totalQuestions: number;
  onSubtopicSelect: (subtopic: Subtopic) => void;
  onShowAll: () => void;
  showMobileFilters: boolean;
  onToggleMobileFilters: () => void;
}

const SubtopicFilters: React.FC<SubtopicFiltersProps> = ({
  subtopics,
  selectedSubtopicId,
  totalQuestions,
  onSubtopicSelect,
  onShowAll,
  showMobileFilters,
  onToggleMobileFilters,
}) => {
  const FilterButtons = () => (
    <div className="flex flex-wrap gap-2">
      <button
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          selectedSubtopicId === null
            ? 'bg-blue-600 text-white shadow-md'
          : 'text-white hover:bg-gray-200 bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        onClick={onShowAll}
      >
        <Star className="h-4 w-4 mr-2" />
        <span>All Questions</span>
        {/* <Badge className="ml-2 bg-white/20 text-current border-none text-xs">
          {totalQuestions}
        </Badge> */}
      </button>
      
      {subtopics.map((subtopic) => (
        subtopic.total_questions > 0 && (
          <button
            key={subtopic.uid}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSubtopicId === subtopic.uid
                ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => onSubtopicSelect(subtopic)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            <span className="truncate max-w-32">{subtopic.subtopic_name}</span>
            <Badge className="ml-2 bg-white/20 text-current border-none text-xs">
              {subtopic.total_questions}
            </Badge>
          </button>
        )
      ))}
    </div>
  );

  if (!subtopics || subtopics.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-6">
      {/* Mobile Filter Toggle */}
      <div className="sm:hidden mb-3">
        <Button
          variant="outline"
          onClick={onToggleMobileFilters}
          className="w-full justify-between"
        >
          <span>Filter by Subtopic</span>
          {showMobileFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm bg-gray-800/80">
          <CardContent className="p-3 sm:p-4">
            <FilterButtons />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubtopicFilters;
