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

          <Button
            variant="default"
            className="bg-cyan-400 text-black font-semibold"
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4 dark:text-white" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Main Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

            <div className="space-y-2">
              <Select value={selectedTeachingType} onValueChange={setSelectedTeachingType}>
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="Teaching Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="ONLINE" className="text-white hover:bg-slate-700">Online</SelectItem>
                  <SelectItem value="OFFLINE" className="text-white hover:bg-slate-700">Offline</SelectItem>
                  <SelectItem value="BOTH" className="text-white hover:bg-slate-700">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters &&
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                  <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <ScrollArea className="h-60">
                      {divisions.map((division) => (
                        <SelectItem key={division.id} value={division.id.toString()} className="text-white hover:bg-slate-700">
                          {division.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

              <Select
                value={selectedDistrict}
                onValueChange={handleDistrictChange}
                disabled={!selectedDivision}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg disabled:opacity-50">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <ScrollArea className="h-60">
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()} className="text-white hover:bg-slate-700">
                        {district.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              <Select
                value={selectedUpazila}
                onValueChange={handleUpazilaChange}
                disabled={!selectedDistrict}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg disabled:opacity-50">
                  <SelectValue placeholder="Upazila" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <ScrollArea className="h-60">
                    {upazilas.map((upazila) => (
                      <SelectItem key={upazila.id} value={upazila.id.toString()} className="text-white hover:bg-slate-700">
                        {upazila.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              <Select
                value={selectedArea}
                onValueChange={handleAreaSelect}
                disabled={!selectedUpazila}
              >
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg disabled:opacity-50">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <ScrollArea className="h-60">
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()} className="text-white hover:bg-slate-700">
                        {area.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Select value={selectedSalaryRange} onValueChange={setSelectedSalaryRange}>
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="0-1000" className="text-white hover:bg-slate-700">৳0 - ৳1000</SelectItem>
                  <SelectItem value="1000-2000" className="text-white hover:bg-slate-700">৳1000 - ৳2000</SelectItem>
                  <SelectItem value="2000+" className="text-white hover:bg-slate-700">৳2000+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-full h-12 text-white bg-slate-800/50 border border-slate-600 hover:border-slate-500 transition-colors rounded-lg">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="4" className="text-white hover:bg-slate-700">4+ Stars</SelectItem>
                  <SelectItem value="3" className="text-white hover:bg-slate-700">3+ Stars</SelectItem>
                  <SelectItem value="2" className="text-white hover:bg-slate-700">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </>
          }

          {/* Active Filters Section */}
          {hasActiveFilters && (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Active Filters:</h4>
                <span className="text-xs text-gray-400">
                  {[selectedInstitutionName, selectedDivisionName, selectedDistrictName, selectedUpazilaName,
                    selectedAreaName, selectedSubjectName, selectedTeachingType, selectedSalaryRange,
                    selectedRating, selectedGender].filter(Boolean).length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInstitutionName && (
                  <div className="flex items-center bg-blue-900/50 text-blue-200 px-3 py-2 rounded-full text-sm font-medium border border-blue-700">
                    <span>Institution: {selectedInstitutionName}</span>
                    <button onClick={() => clearFilter('institution')} className="ml-2 hover:text-blue-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedDivisionName && (
                  <div className="flex items-center bg-green-900/50 text-green-200 px-3 py-2 rounded-full text-sm font-medium border border-green-700">
                    <span>Division: {selectedDivisionName}</span>
                    <button onClick={() => clearFilter('division')} className="ml-2 hover:text-green-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedDistrictName && (
                  <div className="flex items-center bg-purple-900/50 text-purple-200 px-3 py-2 rounded-full text-sm font-medium border border-purple-700">
                    <span>District: {selectedDistrictName}</span>
                    <button onClick={() => clearFilter('district')} className="ml-2 hover:text-purple-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedUpazilaName && (
                  <div className="flex items-center bg-yellow-900/50 text-yellow-200 px-3 py-2 rounded-full text-sm font-medium border border-yellow-700">
                    <span>Upazila: {selectedUpazilaName}</span>
                    <button onClick={() => clearFilter('upazila')} className="ml-2 hover:text-yellow-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedAreaName && (
                  <div className="flex items-center bg-orange-900/50 text-orange-200 px-3 py-2 rounded-full text-sm font-medium border border-orange-700">
                    <span>Area: {selectedAreaName}</span>
                    <button onClick={() => clearFilter('area')} className="ml-2 hover:text-orange-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedSubjectName && (
                  <div className="flex items-center bg-pink-900/50 text-pink-200 px-3 py-2 rounded-full text-sm font-medium border border-pink-700">
                    <span>Subject: {selectedSubjectName}</span>
                    <button onClick={() => clearFilter('subject')} className="ml-2 hover:text-pink-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedTeachingType && (
                  <div className="flex items-center bg-indigo-900/50 text-indigo-200 px-3 py-2 rounded-full text-sm font-medium border border-indigo-700">
                    <span>Teaching: {selectedTeachingType}</span>
                    <button onClick={() => clearFilter('teaching_type')} className="ml-2 hover:text-indigo-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedSalaryRange && (
                  <div className="flex items-center bg-teal-900/50 text-teal-200 px-3 py-2 rounded-full text-sm font-medium border border-teal-700">
                    <span>Salary: {selectedSalaryRange}</span>
                    <button onClick={() => clearFilter('salary_range')} className="ml-2 hover:text-teal-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedRating && (
                  <div className="flex items-center bg-red-900/50 text-red-200 px-3 py-2 rounded-full text-sm font-medium border border-red-700">
                    <span>Rating: {selectedRating}+ Stars</span>
                    <button onClick={() => clearFilter('rating')} className="ml-2 hover:text-red-100 transition-colors" title="Remove filter">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {selectedGender && (
                  <div className="flex items-center bg-slate-900/50 text-slate-200 px-3 py-2 rounded-full text-sm font-medium border border-slate-700">
                    <span className="capitalize">Gender: {selectedGender}</span>
                    <button onClick={() => clearFilter('gender')} className="ml-2 hover:text-slate-100 transition-colors" title="Remove filter">
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