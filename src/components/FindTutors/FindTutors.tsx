import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TutorFilters from './TutorFilters';
import TutorGrid from './TutorGrid';

const FindTutorsList = () => {
  return (
    <div className="container gap-6 mt-8 mb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Find Tutors</h1>
        <p className="text-gray-600">Find and explore various types of tutors</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">All Tutors</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 w-[300px]"
              placeholder="Search"
              type="search"
            />
          </div>
          <Button variant="default" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <TutorFilters />

      <div className="overflow-y-auto flex-grow"> {/* Scrollable container for TutorGrid */}
        <TutorGrid />
      </div>
    </div>
  );
};

export default FindTutorsList;