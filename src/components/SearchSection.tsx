import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { X, Search } from "lucide-react";

const SearchSection: React.FC = () => {
  
  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedInstitutionName, setSelectedInstitutionName] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [selectedCityID, setSelectedCityID] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<{id: number, name: string}[]>([]);
  const [subjects, setSubjects] = useState<{id: number, subject: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/institutes/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch institutions: ${response.status}`);
      }
      const data = await response.json();
      setInstitutions(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching institutions.");
      toast.error("Failed to load institutions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCities = useCallback(async (searchName?: string) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/upazilas/`;
      if (searchName) {
        url += `?search=${encodeURIComponent(searchName)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch upazilas: ${response.status}`);
      }
      const data = await response.json();
      setCities(data.results || []);
    } catch (err: any) {
      console.error("Error fetching upazilas:", err);
      toast.error("Failed to load upazilas");
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subjects/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data.results || []);
    } catch (err: any) {
      console.error("Error fetching subjects:", err);
      toast.error("Failed to load subjects");
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
    fetchCities();
    fetchSubjects();
  }, [fetchInstitutions, fetchCities, fetchSubjects]);

  // Debounced city search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (citySearchQuery.trim()) {
        fetchCities(citySearchQuery);
      } else {
        fetchCities();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearchQuery, fetchCities]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    
    // Build URL params
    const params = new URLSearchParams();
    
    if (selectedInstitutionName) {
      params.append("institute", selectedInstitutionName);
    }
    
    if (selectedCityID) {
      params.append("upazila", selectedCityID.toString());
    }
    
    if (selectedSubjectName) {
      params.append("subject", selectedSubjectName);
    }
    
    if (selectedGender) {
      params.append("gender", selectedGender);
    }
    
    window.history.replaceState(null, '', `?${params.toString()}`);
    
    // Dispatch the custom event for components that listen to it
    window.dispatchEvent(
      new CustomEvent("tutor-search", {
        detail: {
          institute: selectedInstitutionName,
          upazila: selectedCityID,
          subject: selectedSubjectName,
          gender: selectedGender,
        },
      })
    );

    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 1000);
  }, [selectedInstitutionName, selectedCityName, selectedSubjectName, selectedGender]);

  // Auto-trigger search when any filter changes
  useEffect(() => {
    handleSearch();
  }, [selectedInstitutionName, selectedCityName, selectedSubjectName, selectedGender, handleSearch]);

  const handleInstitutionSelect = (value: string) => {
    setSelectedInstitution(value);
    // Find the institution name from the ID
    const institution = institutions.find(inst => inst.id.toString() === value);
    if (institution) {
      setSelectedInstitutionName(institution.name);
    }
    setSearchQuery(""); // Clear search query on selection
    setIsOpen(false); // Close dropdown after selection
  };

  const handleCitySelect = (value: string) => {
    setSelectedCity(value);
    // Find the city name from the ID
    const city = cities.find(c => c.id.toString() === value);
    if (city) {
      setSelectedCityName(city.name);
      setSelectedCityID(city.id.toString());
    }
    setCitySearchQuery(""); // Clear search query on selection
    setIsCityOpen(false); // Close dropdown after selection
  };

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
    // Find the subject name from the ID
    const subject = subjects.find(s => s.id.toString() === value);
    if (subject) {
      setSelectedSubjectName(subject.subject);
    }
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(selectedGender === gender ? "" : gender);
  };

  const clearFilter = (filterType: 'institution' | 'city' | 'subject' | 'gender') => {
    switch (filterType) {
      case 'institution':
        setSelectedInstitution("");
        setSelectedInstitutionName("");
        break;
      case 'city':
        setSelectedCity("");
        setSelectedCityName("");
        setSelectedCityID('');
        break;
      case 'subject':
        setSelectedSubject("");
        setSelectedSubjectName("");
        break;
      case 'gender':
        setSelectedGender("");
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedInstitution("");
    setSelectedInstitutionName("");
    setSelectedCity("");
    setSelectedCityName("");
    setSelectedCityID('');
    setSelectedSubject("");
    setSelectedSubjectName("");
    setSelectedGender("");
  };

  const hasActiveFilters = selectedInstitutionName || selectedCityName || selectedSubjectName || selectedGender;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading Institutions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-3 text-red-600 border-red-200"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white relative py-10 dark:bg-gray-800">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Find a right tutor in your area
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 dark:bg-gray-900 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 font-medium text-lg dark:text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEARCH TUTOR
            </h3>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-red-600 border-gray-300"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 mb-2 dark:text-gray-300">
                Institution
              </label>
              <Select 
                open={isOpen} 
                onOpenChange={setIsOpen}
                value={selectedInstitution}
                onValueChange={handleInstitutionSelect}
              >
                <SelectTrigger className="w-full text-black dark:text-white border-gray-300 hover:border-blue-400 transition-colors dark:border-gray-700">
                  <SelectValue placeholder="Select Institution" className="text-black dark:text-white" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-white z-10 dark:bg-gray-900">
                    <Input
                      placeholder="Search Institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0 text-black dark:text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-60">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((institution) => (
                        <SelectItem
                          key={institution.id}
                          value={institution.id.toString()}
                          className="text-black hover:bg-blue-50 dark:text-white"
                        >
                          {institution.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 dark:text-white">
                        No institutions found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 mb-2 dark:text-gray-300">
                Upazila
              </label>
              <Select
                open={isCityOpen}
                onOpenChange={setIsCityOpen}
                value={selectedCity}
                onValueChange={handleCitySelect}
              >
                <SelectTrigger className="w-full h-10 text-black dark:text-white border-gray-300 hover:border-blue-400 transition-colors dark:border-gray-700">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-white z-10 dark:bg-gray-900">
                    <Input
                      placeholder="Search City..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0 text-black dark:text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-60">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <SelectItem 
                          key={city.id} 
                          value={city.id.toString()}
                          className="text-black hover:bg-blue-50 dark:text-white"
                        >
                          {city.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 dark:text-white">
                        No cities found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 mb-2 dark:text-gray-300">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectSelect}
              >
                <SelectTrigger className="w-full h-10 text-black dark:text-white border-gray-300 hover:border-blue-400 transition-colors dark:border-gray-700">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {subjects.map((subject) => (
                      <SelectItem 
                        key={subject.id} 
                        value={subject.id.toString()}
                        className="text-black hover:bg-blue-50 dark:text-white"
                      >
                        {subject.subject}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Section */}
          {hasActiveFilters && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {[selectedInstitutionName, selectedCityName, selectedSubjectName, selectedGender].filter(Boolean).length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInstitutionName && (
                  <div className="flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-2 rounded-full text-sm font-medium shadow-sm">
                    <span>Institution: {selectedInstitutionName}</span>
                    <button 
                      onClick={() => clearFilter('institution')}
                      className="ml-2 hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedCityName && (
                  <div className="flex items-center bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-3 py-2 rounded-full text-sm font-medium shadow-sm">
                    <span>City: {selectedCityName}</span>
                    <button 
                      onClick={() => clearFilter('city')}
                      className="ml-2 hover:text-green-900 dark:hover:text-green-200 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedSubjectName && (
                  <div className="flex items-center bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-3 py-2 rounded-full text-sm font-medium shadow-sm">
                    <span>Subject: {selectedSubjectName}</span>
                    <button 
                      onClick={() => clearFilter('subject')}
                      className="ml-2 hover:text-purple-900 dark:hover:text-purple-200 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedGender && (
                  <div className="flex items-center bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-100 px-3 py-2 rounded-full text-sm font-medium shadow-sm">
                    <span>Gender: {selectedGender}</span>
                    <button 
                      onClick={() => clearFilter('gender')}
                      className="ml-2 hover:text-pink-900 dark:hover:text-pink-200 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={selectedGender === "MALE"}
                  onChange={() => handleGenderSelect("MALE")}
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Male
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={selectedGender === "FEMALE"}
                  onChange={() => handleGenderSelect("FEMALE")}
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Female
                </span>
              </label>
            </div>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white font-medium px-6 py-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Tutor
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;