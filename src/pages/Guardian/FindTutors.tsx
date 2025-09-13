
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TutorGrid from '../../components/FindTutors/TutorGrid';
import { ScrollArea } from '../../components/ui/scroll-area';
import DashboardHeader from '../../components/DashboardHeader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchSection from '@/components/SearchSection';

const FindTutorsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "Tution Wave | Find Tutors";
  }, []);

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
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen w-full">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <SearchSection />
      </ScrollArea>
    </div>
  );
};

export default FindTutorsList;
