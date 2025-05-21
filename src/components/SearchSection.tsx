
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

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  
  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
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

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cities/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.status}`);
      }
      const data = await response.json();
      setCities(data.results || []);
    } catch (err: any) {
      console.error("Error fetching cities:", err);
      toast.error("Failed to load cities");
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

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedInstitution) {
      params.append("institute", selectedInstitution);
    }
    
    if (selectedCity) {
      params.append("city", selectedCity);
    }
    
    if (selectedSubject) {
      params.append("subjects", selectedSubject);
    }
    
    if (selectedGender) {
      params.append("gender", selectedGender);
    }

    // Navigate to search results with the parameters
    navigate(`/all-tutors?${params.toString()}`);
    
    // Also pass the search parameters to the TutorSearchResults component
    window.dispatchEvent(
      new CustomEvent("tutor-search", {
        detail: {
          institute: selectedInstitution,
          city: selectedCity,
          subjects: selectedSubject,
          gender: selectedGender,
        },
      })
    );
  };

  const handleInstitutionSelect = (value: string) => {
    setSelectedInstitution(value);
    setSearchQuery(""); // Clear search query on selection
    setIsOpen(false); // Close dropdown after selection
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
              <label className="block text-xs text-gray-500 mb-1 dark:text-white">City</label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
              >
                <SelectTrigger className="w-full h-10 text-black dark:text-white">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {cities.map((city) => (
                      <SelectItem 
                        key={city.id} 
                        value={city.id.toString()}
                        className="text-black"
                      >
                        {city.name}
                      </SelectItem>
                    ))}
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
                onValueChange={setSelectedSubject}
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
