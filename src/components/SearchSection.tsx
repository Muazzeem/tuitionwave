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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  
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
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<{id: number, name: string}[]>([]);
  const [subjects, setSubjects] = useState<{id: number, subject: string}[]>([]);

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

  const handleSearch = () => {
    // Build URL params
    const params = new URLSearchParams();
    
    if (selectedInstitutionName) {
      params.append("institute", selectedInstitutionName);
    }
    
    if (selectedCityName) {
      params.append("city", selectedCityName);
    }
    
    if (selectedSubjectName) {
      params.append("subject", selectedSubjectName);
    }
    
    if (selectedGender) {
      params.append("gender", selectedGender);
    }
    
    // Update the URL without causing a page navigation
    window.history.replaceState(null, '', `?${params.toString()}`);
    
    console.log("Search initiated with params:", {
      institute: selectedInstitutionName,
      city: selectedCityName,
      subject: selectedSubjectName,
      gender: selectedGender
    });
    
    // Dispatch the custom event for components that listen to it
    window.dispatchEvent(
      new CustomEvent("tutor-search", {
        detail: {
          institute: selectedInstitutionName,
          city: selectedCityName,
          subject: selectedSubjectName,
          gender: selectedGender,
        },
      })
    );
  };

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

  const clearFilter = (filterType: 'institution' | 'city' | 'subject' | 'gender') => {
    switch (filterType) {
      case 'institution':
        setSelectedInstitution("");
        setSelectedInstitutionName("");
        break;
      case 'city':
        setSelectedCity("");
        setSelectedCityName("");
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

  if (loading) {
    return <div className="p-4 text-center">Loading Institutions...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="search-section text-white py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <img
          src="/lovable-uploads/cover-image.jpg"
          alt="Tutor helping student"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            QUICK SEARCH FOR TUTORS
          </h1>
          <p className="text-xl">FIND A RIGHT TUTOR IN YOUR AREA.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-900">
          <h3 className="text-gray-800 font-medium text-lg mb-4 dark:text-white">
            SEARCH TUTOR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 dark:text-white">
                Institution
              </label>
              <Select 
                open={isOpen} 
                onOpenChange={setIsOpen}
                value={selectedInstitution}
                onValueChange={handleInstitutionSelect}
              >
                <SelectTrigger className="w-full text-black dark:text-white">
                  <SelectValue placeholder="Institution" className="text-black dark:text-white" />
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
                          className="text-black"
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

            <div>
              <label className="block text-xs text-gray-500 mb-1 dark:text-white">Upazila</label>
              <Select
                open={isCityOpen}
                onOpenChange={setIsCityOpen}
                value={selectedCity}
                onValueChange={handleCitySelect}
              >
                <SelectTrigger className="w-full h-10 text-black dark:text-white">
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
                          className="text-black"
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

            <div>
              <label className="block text-xs text-gray-500 mb-1 dark:text-white">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectSelect}
              >
                <SelectTrigger className="w-full h-10 text-black dark:text-white">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {subjects.map((subject) => (
                      <SelectItem 
                        key={subject.id} 
                        value={subject.id.toString()}
                        className="text-black"
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
          {(selectedInstitutionName || selectedCityName || selectedSubjectName || selectedGender) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedInstitutionName && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>Institution: {selectedInstitutionName}</span>
                  <button 
                    onClick={() => clearFilter('institution')}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {selectedCityName && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>City: {selectedCityName}</span>
                  <button 
                    onClick={() => clearFilter('city')}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {selectedSubjectName && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>Subject: {selectedSubjectName}</span>
                  <button 
                    onClick={() => clearFilter('subject')}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {selectedGender && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>Gender: {selectedGender}</span>
                  <button 
                    onClick={() => clearFilter('gender')}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="gender" 
                  className="h-4 w-4"
                  checked={selectedGender === "MALE"}
                  onChange={() => setSelectedGender("MALE")}
                />
                <span className="text-gray-600 dark:text-white">Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="gender" 
                  className="h-4 w-4"
                  checked={selectedGender === "FEMALE"}
                  onChange={() => setSelectedGender("FEMALE")}
                />
                <span className="text-gray-600 dark:text-white">Female</span>
              </label>
            </div>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white"
              onClick={handleSearch}
            >
              SEARCH TUTOR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;