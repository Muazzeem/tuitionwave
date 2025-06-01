
import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search } from 'lucide-react';
import axios from 'axios';
import { getAccessToken } from '@/utils/auth';

interface Division {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  division: {
    id: number;
    name: string;
  };
}

interface Upazila {
  id: number;
  name: string;
  district: {
    id: number;
    name: string;
    division: {
      id: number;
      name: string;
    };
  };
}

interface Area {
  id: number;
  name: string;
}

interface LocationSelectorProps {
  selectedDivision?: string;
  selectedDistrict?: string;
  selectedUpazila?: string;
  selectedArea?: string;
  onDivisionChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onUpazilaChange: (value: string) => void;
  onAreaChange: (value: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedArea,
  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  onAreaChange,
}) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  const [divisionSearch, setDivisionSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [upazilaSearch, setUpazilaSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  
  const [divisionPage, setDivisionPage] = useState(1);
  const [districtPage, setDistrictPage] = useState(1);
  const [upazilaPage, setUpazilaPage] = useState(1);
  const [areaPage, setAreaPage] = useState(1);
  
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const accessToken = getAccessToken();

  // Fetch divisions
  const fetchDivisions = useCallback(async (page = 1, search = '') => {
    try {
      setLoadingDivisions(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/divisions/`, {
        params: { page, search },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (page === 1) {
        setDivisions(response.data.results);
      } else {
        setDivisions(prev => [...prev, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoadingDivisions(false);
    }
  }, [accessToken]);

  // Fetch districts
  const fetchDistricts = useCallback(async (divisionId: string, page = 1, search = '') => {
    try {
      setLoadingDistricts(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/districts/`, {
        params: { division: divisionId, page, search },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (page === 1) {
        setDistricts(response.data.results);
      } else {
        setDistricts(prev => [...prev, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  }, [accessToken]);

  // Fetch upazilas
  const fetchUpazilas = useCallback(async (districtId: string, page = 1, search = '') => {
    try {
      setLoadingUpazilas(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/upazilas/`, {
        params: { district: districtId, page, search },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (page === 1) {
        setUpazilas(response.data.results);
      } else {
        setUpazilas(prev => [...prev, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching upazilas:', error);
    } finally {
      setLoadingUpazilas(false);
    }
  }, [accessToken]);

  // Fetch areas
  const fetchAreas = useCallback(async (page = 1, search = '') => {
    try {
      setLoadingAreas(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/areas/`, {
        params: { page, search },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (page === 1) {
        setAreas(response.data.results);
      } else {
        setAreas(prev => [...prev, ...response.data.results]);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoadingAreas(false);
    }
  }, [accessToken]);

  // Initial data fetch
  useEffect(() => {
    fetchDivisions();
    fetchAreas();
  }, [fetchDivisions, fetchAreas]);

  // Fetch districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      setDistricts([]);
      setDistrictPage(1);
      fetchDistricts(selectedDivision);
    }
  }, [selectedDivision, fetchDistricts]);

  // Fetch upazilas when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setUpazilas([]);
      setUpazilaPage(1);
      fetchUpazilas(selectedDistrict);
    }
  }, [selectedDistrict, fetchUpazilas]);

  // Search handlers
  useEffect(() => {
    const timer = setTimeout(() => {
      if (divisionSearch !== '') {
        setDivisionPage(1);
        fetchDivisions(1, divisionSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [divisionSearch, fetchDivisions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (districtSearch !== '' && selectedDivision) {
        setDistrictPage(1);
        fetchDistricts(selectedDivision, 1, districtSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [districtSearch, selectedDivision, fetchDistricts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (upazilaSearch !== '' && selectedDistrict) {
        setUpazilaPage(1);
        fetchUpazilas(selectedDistrict, 1, upazilaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [upazilaSearch, selectedDistrict, fetchUpazilas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (areaSearch !== '') {
        setAreaPage(1);
        fetchAreas(1, areaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [areaSearch, fetchAreas]);

  const handleDivisionChange = (value: string) => {
    onDivisionChange(value);
    onDistrictChange('');
    onUpazilaChange('');
    setSelectedDistrict('');
    setSelectedUpazila('');
  };

  const handleDistrictChange = (value: string) => {
    onDistrictChange(value);
    onUpazilaChange('');
    setSelectedUpazila('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Division */}
      <div>
        <Label htmlFor="division">Division</Label>
        <Select value={selectedDivision} onValueChange={handleDivisionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search divisions..."
                  value={divisionSearch}
                  onChange={(e) => setDivisionSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-48">
              {divisions.map((division) => (
                <SelectItem key={division.id} value={division.id.toString()}>
                  {division.name}
                </SelectItem>
              ))}
              {loadingDivisions && (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div>
        <Label htmlFor="district">District</Label>
        <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedDivision}>
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search districts..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-48">
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
              {loadingDistricts && (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {/* Upazila */}
      <div>
        <Label htmlFor="upazila">Upazila</Label>
        <Select value={selectedUpazila} onValueChange={onUpazilaChange} disabled={!selectedDistrict}>
          <SelectTrigger>
            <SelectValue placeholder="Select Upazila" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search upazilas..."
                  value={upazilaSearch}
                  onChange={(e) => setUpazilaSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-48">
              {upazilas.map((upazila) => (
                <SelectItem key={upazila.id} value={upazila.id.toString()}>
                  {upazila.name}
                </SelectItem>
              ))}
              {loadingUpazilas && (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {/* Area */}
      <div>
        <Label htmlFor="area">Area</Label>
        <Select value={selectedArea} onValueChange={onAreaChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Area" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search areas..."
                  value={areaSearch}
                  onChange={(e) => setAreaSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <ScrollArea className="h-48">
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.name}
                </SelectItem>
              ))}
              {loadingAreas && (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
