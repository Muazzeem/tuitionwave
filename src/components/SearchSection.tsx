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
import { X, Search, Filter } from "lucide-react";
import { Badge } from "./ui/badge";

const SearchSection: React.FC = () => {
  // All filter states
  const [institutions, setInstitutions] = useState<{ id: number; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [upazilas, setUpazilas] = useState<{ id: number; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; subject: string }[]>([]);

  // Search queries
  const [searchQuery, setSearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");

  // Dropdown states
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Selected filter states
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedInstitutionName, setSelectedInstitutionName] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDivisionName, setSelectedDivisionName] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedAreaName, setSelectedAreaName] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>("");
  const [selectedTeachingType, setSelectedTeachingType] = useState<string>("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch functions
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

  const fetchDivisions = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/divisions/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch divisions: ${response.status}`);
      }
      const data = await response.json();
      setDivisions(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching divisions.");
      toast.error("Failed to load divisions");
    }
  }, []);

  const fetchDistricts = useCallback(async (divisionId: string) => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/districts/?division=${divisionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch districts: ${response.status}`);
      }
      const data = await response.json();
      setDistricts(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching districts.");
      toast.error("Failed to load districts");
    }
  }, []);

  const fetchUpazilas = useCallback(async (districtId: string) => {
    if (!districtId) {
      setUpazilas([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upazilas/?district=${districtId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch upazilas: ${response.status}`);
      }
      const data = await response.json();
      setUpazilas(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching upazilas.");
      toast.error("Failed to load upazilas");
    }
  }, []);

  const fetchAreas = useCallback(async (upazilaId: string) => {
    if (!upazilaId) {
      setAreas([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/areas/?upazila=${upazilaId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch areas: ${response.status}`);
      }
      const data = await response.json();
      setAreas(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching areas.");
      toast.error("Failed to load areas");
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

  // Handle cascading location changes
  const handleDivisionChange = useCallback((value: string) => {
    setSelectedDivision(value);
    const division = divisions.find(d => d.id.toString() === value);
    setSelectedDivisionName(division?.name || "");

    // Reset dependent fields
    setSelectedDistrict("");
    setSelectedDistrictName("");
    setSelectedUpazila("");
    setSelectedUpazilaName("");
    setSelectedArea("");
    setSelectedAreaName("");
    setDistricts([]);
    setUpazilas([]);
    setAreas([]);

    if (value) {
      fetchDistricts(value);
    }
  }, [divisions, fetchDistricts]);

  const handleDistrictChange = useCallback((value: string) => {
    setSelectedDistrict(value);
    const district = districts.find(d => d.id.toString() === value);
    setSelectedDistrictName(district?.name || "");

    // Reset dependent fields
    setSelectedUpazila("");
    setSelectedUpazilaName("");
    setSelectedArea("");
    setSelectedAreaName("");
    setUpazilas([]);
    setAreas([]);

    if (value) {
      fetchUpazilas(value);
    }
  }, [districts, fetchUpazilas]);

  const handleUpazilaChange = useCallback((value: string) => {
    setSelectedUpazila(value);
    const upazila = upazilas.find(u => u.id.toString() === value);
    setSelectedUpazilaName(upazila?.name || "");

    // Reset dependent fields
    setSelectedArea("");
    setSelectedAreaName("");
    setAreas([]);

    if (value) {
      fetchAreas(value);
    }
  }, [upazilas, fetchAreas]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchInstitutions(),
        fetchDivisions(),
        fetchSubjects()
      ]);
      setLoading(false);
    };

    initializeData();
  }, [fetchInstitutions, fetchDivisions, fetchSubjects]);

  // Filter functions
  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search
  const handleSearch = useCallback(() => {
    setIsSearching(true);

    // Build URL params
    const params = new URLSearchParams();

    if (selectedInstitutionName) {
      params.append("institute", selectedInstitutionName);
    }
    if (selectedDivision) {
      params.append("division", selectedDivision);
    }
    if (selectedDistrict) {
      params.append("districts", selectedDistrict);
    }
    if (selectedUpazila) {
      params.append("upazila", selectedUpazila);
    }
    if (selectedArea) {
      params.append("area", selectedArea);
    }
    if (selectedSubject) {
      params.append("subjects", selectedSubject);
    }
    if (selectedTeachingType) {
      params.append("teaching_type", selectedTeachingType);
    }
    if (selectedSalaryRange) {
      params.append("salary_range", selectedSalaryRange);
    }
    if (selectedRating) {
      params.append("rating", selectedRating);
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
          division: selectedDivision,
          districts: selectedDistrict,
          upazila: selectedUpazila,
          area: selectedArea,
          subjects: selectedSubject,
          teaching_type: selectedTeachingType,
          salary_range: selectedSalaryRange,
          rating: selectedRating,
          gender: selectedGender,
        },
      })
    );

    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 1000);
  }, [
    selectedInstitutionName, selectedDivision, selectedDistrict, selectedUpazila,
    selectedArea, selectedSubject, selectedTeachingType, selectedSalaryRange,
    selectedRating, selectedGender
  ]);

  // Auto-trigger search when any filter changes
  useEffect(() => {
    handleSearch();
  }, [
    selectedInstitutionName, selectedDivision, selectedDistrict, selectedUpazila,
    selectedArea, selectedSubject, selectedTeachingType, selectedSalaryRange,
    selectedRating, selectedGender, handleSearch
  ]);

  // Handle selections
  const handleInstitutionSelect = (value: string) => {
    setSelectedInstitution(value);
    const institution = institutions.find(inst => inst.id.toString() === value);
    if (institution) {
      setSelectedInstitutionName(institution.name);
    }
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleAreaSelect = (value: string) => {
    setSelectedArea(value);
    const area = areas.find(a => a.id.toString() === value);
    if (area) {
      setSelectedAreaName(area.name);
    }
  };

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
    const subject = subjects.find(s => s.id.toString() === value);
    if (subject) {
      setSelectedSubjectName(subject.subject);
    }
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(selectedGender === gender ? "" : gender);
  };

  // Clear filter functions
  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case 'institution':
        setSelectedInstitution("");
        setSelectedInstitutionName("");
        break;
      case 'division':
        setSelectedDivision("");
        setSelectedDivisionName("");
        setSelectedDistrict("");
        setSelectedDistrictName("");
        setSelectedUpazila("");
        setSelectedUpazilaName("");
        setSelectedArea("");
        setSelectedAreaName("");
        setDistricts([]);
        setUpazilas([]);
        setAreas([]);
        break;
      case 'district':
        setSelectedDistrict("");
        setSelectedDistrictName("");
        setSelectedUpazila("");
        setSelectedUpazilaName("");
        setSelectedArea("");
        setSelectedAreaName("");
        setUpazilas([]);
        setAreas([]);
        break;
      case 'upazila':
        setSelectedUpazila("");
        setSelectedUpazilaName("");
        setSelectedArea("");
        setSelectedAreaName("");
        setAreas([]);
        break;
      case 'area':
        setSelectedArea("");
        setSelectedAreaName("");
        break;
      case 'subject':
        setSelectedSubject("");
        setSelectedSubjectName("");
        break;
      case 'teaching_type':
        setSelectedTeachingType("");
        break;
      case 'salary_range':
        setSelectedSalaryRange("");
        break;
      case 'rating':
        setSelectedRating("");
        break;
      case 'gender':
        setSelectedGender("");
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedInstitution("");
    setSelectedInstitutionName("");
    setSelectedDivision("");
    setSelectedDivisionName("");
    setSelectedDistrict("");
    setSelectedDistrictName("");
    setSelectedUpazila("");
    setSelectedUpazilaName("");
    setSelectedArea("");
    setSelectedAreaName("");
    setSelectedSubject("");
    setSelectedSubjectName("");
    setSelectedTeachingType("");
    setSelectedSalaryRange("");
    setSelectedRating("");
    setSelectedGender("");
    setDistricts([]);
    setUpazilas([]);
    setAreas([]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = selectedInstitutionName || selectedDivisionName || selectedDistrictName ||
    selectedUpazilaName || selectedAreaName || selectedSubjectName || selectedTeachingType ||
    selectedSalaryRange || selectedRating || selectedGender;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading Filters...</p>
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
    <div className="relative py-6 sm:py-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 bg-background/95 border border-border backdrop-blur-md">

          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            {/* Title - Mobile first approach */}
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-foreground font-bold text-2xl sm:text-3xl lg:text-4xl mb-2">
                Find a Tutor
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                টিউটর খুঁজুন
              </p>
            </div>

            {/* Top badges - Responsive */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-6">
              <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                5,000+ tutors
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                Fast matching
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                Verified profiles
              </Badge>
            </div>

            {/* Feature Points - Improved mobile layout */}
            <div className="space-y-3 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Reputed universities' students are here — <span className="text-xs sm:text-sm opacity-80">তারা যেকোনো বিষয়ই জন্য অভিজ্ঞ।</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Online tuition = safety + time save.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Home & Online — <span className="text-xs sm:text-sm opacity-80">আপনার পছন্দমতো।</span>
                </p>
              </div>
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div className="flex justify-center sm:justify-start mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Main Search Form */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Institution Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Institution</label>
                <Select
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  value={selectedInstitution}
                  onValueChange={handleInstitutionSelect}
                >
                  <SelectTrigger className="w-full h-11 bg-background border border-border hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="DU / BUET / SUST / NSU / AIUB ..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <div className="p-2 sticky top-0 bg-background z-10 border-b border-border">
                      <Input
                        placeholder="Search Institution..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ScrollArea className="h-60">
                      {filteredInstitutions.length > 0 ? (
                        filteredInstitutions.map((institution) => (
                          <SelectItem
                            key={institution.id}
                            value={institution.id.toString()}
                            className="hover:bg-accent"
                          >
                            {institution.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No institutions found.
                        </div>
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={handleSubjectSelect}
                >
                  <SelectTrigger className="w-full h-11 bg-background border border-border hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Physics, English, Math ..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <ScrollArea className="h-60">
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.id.toString()}
                          className="hover:bg-accent"
                        >
                          {subject.subject}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Teaching Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Teaching Type</label>
                <Select value={selectedTeachingType} onValueChange={setSelectedTeachingType}>
                  <SelectTrigger className="w-full h-11 bg-background border border-border hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Online / Offline / Both" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="ONLINE" className="hover:bg-accent">Online</SelectItem>
                    <SelectItem value="OFFLINE" className="hover:bg-accent">Offline</SelectItem>
                    <SelectItem value="BOTH" className="hover:bg-accent">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="space-y-6 mb-6 p-4 sm:p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
              </div>
              
              {/* Location Filters */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Division</label>
                    <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <ScrollArea className="h-48">
                          {divisions.map((division) => (
                            <SelectItem key={division.id} value={division.id.toString()} className="hover:bg-accent">
                              {division.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">District</label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={handleDistrictChange}
                      disabled={!selectedDivision}
                    >
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors disabled:opacity-50">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <ScrollArea className="h-48">
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id.toString()} className="hover:bg-accent">
                              {district.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Upazila</label>
                    <Select
                      value={selectedUpazila}
                      onValueChange={handleUpazilaChange}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors disabled:opacity-50">
                        <SelectValue placeholder="Select Upazila" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <ScrollArea className="h-48">
                          {upazilas.map((upazila) => (
                            <SelectItem key={upazila.id} value={upazila.id.toString()} className="hover:bg-accent">
                              {upazila.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Area</label>
                    <Select
                      value={selectedArea}
                      onValueChange={handleAreaSelect}
                      disabled={!selectedUpazila}
                    >
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors disabled:opacity-50">
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <ScrollArea className="h-48">
                          {areas.map((area) => (
                            <SelectItem key={area.id} value={area.id.toString()} className="hover:bg-accent">
                              {area.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Other Filters */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Salary Range</label>
                    <Select value={selectedSalaryRange} onValueChange={setSelectedSalaryRange}>
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="0-1000" className="hover:bg-accent">৳0 - ৳1000</SelectItem>
                        <SelectItem value="1000-2000" className="hover:bg-accent">৳1000 - ৳2000</SelectItem>
                        <SelectItem value="2000+" className="hover:bg-accent">৳2000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Rating</label>
                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger className="w-full h-10 bg-background border border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Minimum Rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="4" className="hover:bg-accent">4+ Stars</SelectItem>
                        <SelectItem value="3" className="hover:bg-accent">3+ Stars</SelectItem>
                        <SelectItem value="2" className="hover:bg-accent">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Section */}
          {hasActiveFilters && (
            <div className="bg-card rounded-lg p-4 mb-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">Active Filters</h4>
                <span className="text-xs text-muted-foreground">
                  {[selectedInstitutionName, selectedDivisionName, selectedDistrictName, selectedUpazilaName,
                    selectedAreaName, selectedSubjectName, selectedTeachingType, selectedSalaryRange,
                    selectedRating, selectedGender].filter(Boolean).length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInstitutionName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Institution: {selectedInstitutionName}
                    <button onClick={() => clearFilter('institution')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedDivisionName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Division: {selectedDivisionName}
                    <button onClick={() => clearFilter('division')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedDistrictName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    District: {selectedDistrictName}
                    <button onClick={() => clearFilter('district')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedUpazilaName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Upazila: {selectedUpazilaName}
                    <button onClick={() => clearFilter('upazila')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedAreaName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Area: {selectedAreaName}
                    <button onClick={() => clearFilter('area')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedSubjectName && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Subject: {selectedSubjectName}
                    <button onClick={() => clearFilter('subject')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedTeachingType && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Teaching: {selectedTeachingType}
                    <button onClick={() => clearFilter('teaching_type')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedSalaryRange && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Salary: {selectedSalaryRange}
                    <button onClick={() => clearFilter('salary_range')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedRating && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Rating: {selectedRating}+ Stars
                    <button onClick={() => clearFilter('rating')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedGender && (
                  <Badge variant="secondary" className="gap-1 pr-1 capitalize">
                    Gender: {selectedGender}
                    <button onClick={() => clearFilter('gender')} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" title="Remove filter">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Bottom Section with Gender Selection and Search Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            {/* Gender Selection */}
            <div className="flex justify-center sm:justify-start">
              <div className="flex items-center gap-6 p-3 bg-card rounded-lg border border-border">
                <span className="text-sm font-medium text-muted-foreground">Gender:</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                    checked={selectedGender === "MALE"}
                    onChange={() => handleGenderSelect("MALE")}
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Male
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                    checked={selectedGender === "FEMALE"}
                    onChange={() => handleGenderSelect("FEMALE")}
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Female
                  </span>
                </label>
              </div>
            </div>

            {/* Search Button */}
            <Button
              size="lg"
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full sm:w-auto px-8 py-3 gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Tutor
                </>
              )}
            </Button>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;