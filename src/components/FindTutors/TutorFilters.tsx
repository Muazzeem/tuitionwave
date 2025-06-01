import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TutorFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; subject: string }[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // State for selected filters
  const [selectedInstitute, setSelectedInstitute] = useState<string>(
    searchParams.get("institute") || ""
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get("city") || ""
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    searchParams.get("subjects") || ""
  );
  const [selectedTeachingType, setSelectedTeachingType] = useState<string>(
    searchParams.get("teaching_type") || ""
  );
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>(
    searchParams.get("salary_range") || ""
  );
  const [selectedRating, setSelectedRating] = useState<string>(
    searchParams.get("rating") || ""
  );
  const [selectedGender, setSelectedGender] = useState<string>(
    searchParams.get("gender") || ""
  );

  const fetchInstitutions = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/institutes/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch institutions: ${response.status}`);
      }
      const data = await response.json();
      setInstitutions(data.results || []);
    } catch (err: any) {           
      setError(err.message || "An error occurred while fetching institutions.");
      toast.error("Failed to load institutions");
    }
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upazilas/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch upazilas: ${response.status}`);
      }
      const data = await response.json();
      setCities(data.results || []);
    } catch (err: any) {           
      setError(err.message || "An error occurred while fetching upazilas.");
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
      setError(err.message || "An error occurred while fetching subjects.");
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchInstitutions(), fetchCities(), fetchSubjects()]);
    };
    
    fetchData();
  }, [fetchInstitutions, fetchCities, fetchSubjects]);

  // Auto-apply filters whenever any filter value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Update or remove each parameter based on selection
    if (selectedInstitute) {
      params.set("institute", selectedInstitute);
    } else {
      params.delete("institute");
    }
    
    if (selectedCity) {
      params.set("preferred_upazila", selectedCity);
    } else {
      params.delete("preferred_upazila");
    }
    
    if (selectedSubject) {
      params.set("subjects", selectedSubject);
    } else {
      params.delete("subjects");
    }
    
    if (selectedTeachingType) {
      params.set("teaching_type", selectedTeachingType);
    } else {
      params.delete("teaching_type");
    }
    
    if (selectedSalaryRange) {
      params.set("salary_range", selectedSalaryRange);
    } else {
      params.delete("salary_range");
    }
    
    if (selectedRating) {
      params.set("rating", selectedRating);
    } else {
      params.delete("rating");
    }
    
    if (selectedGender) {
      params.set("gender", selectedGender);
    } else {
      params.delete("gender");
    }
    
    setSearchParams(params);
  }, [
    selectedInstitute,
    selectedCity,
    selectedSubject,
    selectedTeachingType,
    selectedSalaryRange,
    selectedRating,
    selectedGender,
    setSearchParams,
    searchParams
  ]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setSelectedInstitute("");
    setSelectedCity("");
    setSelectedSubject("");
    setSelectedTeachingType("");
    setSelectedSalaryRange("");
    setSelectedRating("");
    setSelectedGender("");
    setSearchParams(new URLSearchParams());
    toast.success("Filters cleared");
  };

  if (loading) {
    return <div>Loading Filters...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Select 
          value={selectedInstitute} 
          onValueChange={setSelectedInstitute}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Institution" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px] overflow-y-auto">
            <div className="p-2">
              <Input
                placeholder="Search Institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "h-8",
                  "focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
              />
            </div>
            <ScrollArea className="h-[300px] pr-2">
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((institution) => (
                  <SelectItem
                    key={institution.id}
                    value={institution.name.toString()}
                  >
                    {institution.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No institutions found.
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.subject}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select value={selectedTeachingType} onValueChange={setSelectedTeachingType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Teaching Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="BOTH">Both</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSalaryRange} onValueChange={setSelectedSalaryRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1000">৳0 - ৳1000</SelectItem>
            <SelectItem value="1000-2000">৳1000 - ৳2000</SelectItem>
            <SelectItem value="2000+">৳2000+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default TutorFilters;