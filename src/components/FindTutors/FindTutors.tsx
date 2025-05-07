
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TutorFilters from './TutorFilters';
import TutorGrid from './TutorGrid';
import { ScrollArea } from '../ui/scroll-area';

const FindTutorsList = () => {
  return (
    <div className="ml-7 mr-7 mt-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-semibold">All Tutors</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 w-full sm:w-[300px]"
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

      <div className="">
        <ScrollArea type="always" style={{ height: 'calc(95vh - 160px)' }}>
          <TutorGrid />
        </ScrollArea>
      </div>
    </div>
  );
};

export default FindTutorsList;
