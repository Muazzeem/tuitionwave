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
import { Badge } from "./ui/badge";

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
    <div className="text-white relative py-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="rounded-lg shadow-md p-8 bg-background border border-slate-700 backdrop-blur-md">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-3xl flex items-center gap-3">
                Find a Tutor — <span className="text-2xl">টিউটর খুঁজুন</span>
              </h3>

              {/* Top badges */}
              <div className="flex gap-3">
                <Badge className="bg-slate-700/80 text-gray-300 border border-slate-600 px-3 py-1 rounded-full">
                  5,000+ tutors
                </Badge>
                <Badge className="bg-slate-700/80 text-gray-300 border border-slate-600 px-3 py-1 rounded-full">
                  Fast matching
                </Badge>
                <Badge className="bg-slate-700/80 text-gray-300 border border-slate-600 px-3 py-1 rounded-full">
                  Verified profiles
                </Badge>
              </div>
            </div>

            {/* Feature Points */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">
                  Reputed universities' students are here — <span className="text-sm">তারা যেকোনো বিষয়ই জন্য অভিজ্ঞ।</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">
                  Online tuition = safety + time save.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">
                  Home & Online — <span className="text-sm">আপনার পছন্দমতো।</span>
                </p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <Select
                open={isOpen}
                onOpenChange={setIsOpen}
                value={selectedInstitution}
                onValueChange={handleInstitutionSelect}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="DU / BUET / SUST / NSU / AIUB ..." className="text-gray-300" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <div className="p-2 sticky top-0 bg-slate-800 z-10">
                    <Input
                      placeholder="Search Institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0 text-white bg-slate-700 border-slate-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-60">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((institution) => (
                        <SelectItem
                          key={institution.id}
                          value={institution.id.toString()}
                          className="text-white hover:bg-slate-700"
                        >
                          {institution.name}
                        </SelectItem>
                      ))
                    ) : (
                        <div className="p-2 text-sm text-gray-400">
                        No institutions found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select
                open={isCityOpen}
                onOpenChange={setIsCityOpen}
                value={selectedCity}
                onValueChange={handleCitySelect}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="Dhaka — Dhanmondi / Mirpur ..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <div className="p-2 sticky top-0 bg-slate-800 z-10">
                    <Input
                      placeholder="Search City..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0 text-white bg-slate-700 border-slate-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-60">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <SelectItem
                          key={city.id}
                          value={city.id.toString()}
                          className="text-white hover:bg-slate-700"
                        >
                          {city.name}
                        </SelectItem>
                      ))
                    ) : (
                        <div className="p-2 text-sm text-gray-400">
                        No cities found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectSelect}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="Physics, English, Math ..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <ScrollArea className="h-60">
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                        className="text-white hover:bg-slate-700"
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
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Active Filters:</h4>
                <span className="text-xs text-gray-400">
                  {[selectedInstitutionName, selectedCityName, selectedSubjectName, selectedGender].filter(Boolean).length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInstitutionName && (
                  <div className="flex items-center bg-blue-900/50 text-blue-200 px-3 py-2 rounded-full text-sm font-medium border border-blue-700">
                    <span>Institution: {selectedInstitutionName}</span>
                    <button
                      onClick={() => clearFilter('institution')}
                      className="ml-2 hover:text-blue-100 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedCityName && (
                  <div className="flex items-center bg-green-900/50 text-green-200 px-3 py-2 rounded-full text-sm font-medium border border-green-700">
                    <span>City: {selectedCityName}</span>
                    <button
                      onClick={() => clearFilter('city')}
                      className="ml-2 hover:text-green-100 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedSubjectName && (
                  <div className="flex items-center bg-purple-900/50 text-purple-200 px-3 py-2 rounded-full text-sm font-medium border border-purple-700">
                    <span>Subject: {selectedSubjectName}</span>
                    <button
                      onClick={() => clearFilter('subject')}
                      className="ml-2 hover:text-purple-100 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedGender && (
                  <div className="flex items-center bg-pink-900/50 text-pink-200 px-3 py-2 rounded-full text-sm font-medium border border-pink-700">
                    <span className="capitalize">Gender: {selectedGender}</span>
                    <button
                      onClick={() => clearFilter('gender')}
                      className="ml-2 hover:text-pink-100 transition-colors"
                      title="Remove filter"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Section with Gender Selection and Search Button */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-500 bg-transparent"
                  checked={selectedGender === "MALE"}
                  onChange={() => handleGenderSelect("MALE")}
                />
                <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                  Male
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-500 bg-transparent"
                  checked={selectedGender === "FEMALE"}
                  onChange={() => handleGenderSelect("FEMALE")}
                />
                <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                  Female
                </span>
              </label>
            </div>

            <Button
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-3 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Searching...
                </>
              ) : (
                  <>
                  Search Tutor
                </>
              )}
            </Button>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="hover:text-gray-700 border-gray-600 hover:border-gray-400 bg-transparent"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;