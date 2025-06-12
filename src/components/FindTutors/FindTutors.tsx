
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TutorFilters from './TutorFilters';
import TutorGrid from './TutorGrid';
import { ScrollArea } from '../ui/scroll-area';
import DashboardHeader from '../DashboardHeader';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FindTutorsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      applySearchTerm();
    }
  };

  const applySearchTerm = () => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    setSearchParams(params);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
      <DashboardHeader userName="John" />
      <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-5">
        <h2 className="text-2xl font-semibold ml-5">Search Tutors</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 w-full sm:w-[300px]"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div> */}
          <Button 
            variant="default" 
            className="gap-2 dark:text-white"
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4 dark:text-white" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      <div className="">
        {showFilters && <TutorFilters />}
      </div>

      <div className="">
        <ScrollArea type="always" style={{ height: 'calc(95vh - 160px)' }}>
          <TutorGrid />
        </ScrollArea>
      </div>
      </div>
    </div>
  );
};

export default FindTutorsList;
