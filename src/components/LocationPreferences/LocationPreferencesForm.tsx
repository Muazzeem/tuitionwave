import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationDropdown } from './LocationDropdown';
import { useInfiniteLocationData } from './useInfiniteLocationData';
import { Division, District, Upazila } from '@/types/common';

interface Area {
  id: number;
  name: string;
  upazila: number;
}

interface LocationFormData {
  division_id: number | null;
  preferred_district_id: number | null;
  preferred_upazila_id: number | null;
  preferred_area_id: number | null;
  address: string;
}

interface LocationPreferencesFormProps {
  formData: LocationFormData;
  onFormDataChange: (updates: Partial<LocationFormData>) => void;
  initialDivisionName?: string;
  initialDistrictName?: string;
  initialUpazilaName?: string;
  initialAreaName?: string;
}

export const LocationPreferencesForm: React.FC<LocationPreferencesFormProps> = ({
  formData,
  onFormDataChange,
  initialDivisionName = '',
  initialDistrictName = '',
  initialUpazilaName = '',
  initialAreaName = ''
}) => {
  const {
    // Data
    divisions,
    districts,
    upazilas,
    areas,
    
    // Loading states
    loadingDivisions,
    loadingDistricts,
    loadingUpazilas,
    loadingAreas,
    
    // Search states
    divisionSearch,
    setDivisionSearch,
    districtSearch,
    setDistrictSearch,
    upazilaSearch,
    setUpazilaSearch,
    areaSearch,
    setAreaSearch,
    
    // Dropdown states
    showDivisionDropdown,
    setShowDivisionDropdown,
    showDistrictDropdown,
    setShowDistrictDropdown,
    showUpazilaDropdown,
    setShowUpazilaDropdown,
    showAreaDropdown,
    setShowAreaDropdown,
    
    // Scroll refs
    divisionScrollRef,
    districtScrollRef,
    upazilaScrollRef,
    areaScrollRef,
    
    // Next URLs
    divisionsNextUrl,
    districtsNextUrl,
    upazilasNextUrl,
    areasNextUrl,
    
    // Fetch functions
    fetchDivisions,
    fetchDistricts,
    fetchUpazilas,
    fetchAreas,
    
    // Load more functions
    loadMoreDivisions,
    loadMoreDistricts,
    loadMoreUpazilas,
    loadMoreAreas,
    
    // Clear functions
    clearDependentData,
  } = useInfiniteLocationData();

  // Initialize data
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  // Set initial search values
  useEffect(() => {
    if (initialDivisionName) setDivisionSearch(initialDivisionName);
    if (initialDistrictName) setDistrictSearch(initialDistrictName);
    if (initialUpazilaName) setUpazilaSearch(initialUpazilaName);
    if (initialAreaName) setAreaSearch(initialAreaName);
  }, [initialDivisionName, initialDistrictName, initialUpazilaName, initialAreaName]);

  // Handle cascading data fetch
  useEffect(() => {
    if (formData.division_id) {
      fetchDistricts(formData.division_id);
    } else {
      clearDependentData('districts');
      onFormDataChange({
        preferred_district_id: null,
        preferred_upazila_id: null,
        preferred_area_id: null
      });
    }
  }, [formData.division_id, fetchDistricts, clearDependentData, onFormDataChange]);

  useEffect(() => {
    if (formData.preferred_district_id) {
      fetchUpazilas(formData.preferred_district_id);
    } else {
      clearDependentData('upazilas');
      onFormDataChange({
        preferred_upazila_id: null,
        preferred_area_id: null
      });
    }
  }, [formData.preferred_district_id, fetchUpazilas, clearDependentData, onFormDataChange]);

  useEffect(() => {
    if (formData.preferred_upazila_id) {
      fetchAreas(formData.preferred_upazila_id);
    } else {
      clearDependentData('areas');
      onFormDataChange({ preferred_area_id: null });
    }
  }, [formData.preferred_upazila_id, fetchAreas, clearDependentData, onFormDataChange]);

  // Search handlers with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDivisions(divisionSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [divisionSearch, fetchDivisions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.division_id) {
        fetchDistricts(formData.division_id, districtSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [districtSearch, formData.division_id, fetchDistricts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.preferred_district_id) {
        fetchUpazilas(formData.preferred_district_id, upazilaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [upazilaSearch, formData.preferred_district_id, fetchUpazilas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.preferred_upazila_id) {
        fetchAreas(formData.preferred_upazila_id, areaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [areaSearch, formData.preferred_upazila_id, fetchAreas]);

  // Selection handlers
  const handleDivisionSelect = (division: Division) => {
    onFormDataChange({
      division_id: division.id,
      preferred_district_id: null,
      preferred_upazila_id: null,
      preferred_area_id: null
    });
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
    setDistrictSearch('');
    setUpazilaSearch('');
    setAreaSearch('');
  };

  const handleDistrictSelect = (district: District) => {
    onFormDataChange({
      preferred_district_id: district.id,
      preferred_upazila_id: null,
      preferred_area_id: null
    });
    setDistrictSearch(district.name);
    setShowDistrictDropdown(false);
    setUpazilaSearch('');
    setAreaSearch('');
  };

  const handleUpazilaSelect = (upazila: Upazila) => {
    onFormDataChange({
      preferred_upazila_id: upazila.id,
      preferred_area_id: null
    });
    setUpazilaSearch(upazila.name);
    setShowUpazilaDropdown(false);
    setAreaSearch('');
  };

  const handleAreaSelect = (area: Area) => {
    onFormDataChange({ preferred_area_id: area.id });
    setAreaSearch(area.name);
    setShowAreaDropdown(false);
  };

  // Helper functions to get selected names
  const getSelectedDivisionName = () => {
    const selectedDivision = divisions.find(d => d.id === formData.division_id);
    return selectedDivision ? selectedDivision.name : divisionSearch;
  };

  const getSelectedDistrictName = () => {
    const selectedDistrict = districts.find(d => d.id === formData.preferred_district_id);
    return selectedDistrict ? selectedDistrict.name : districtSearch;
  };

  const getSelectedUpazilaName = () => {
    const selectedUpazila = upazilas.find(u => u.id === formData.preferred_upazila_id);
    return selectedUpazila ? selectedUpazila.name : upazilaSearch;
  };

  const getSelectedAreaName = () => {
    const selectedArea = areas.find(a => a.id === formData.preferred_area_id);
    return selectedArea ? selectedArea.name : areaSearch;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange({ address: e.target.value });
  };

  return (
    <div className="bg-card/20 rounded-xl p-6 border border-border/30 space-y-6">
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Location Preferences
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LocationDropdown
          label="Division"
          placeholder="Select Division"
          searchValue={divisionSearch}
          setSearchValue={setDivisionSearch}
          selectedName={getSelectedDivisionName()}
          showDropdown={showDivisionDropdown}
          setShowDropdown={setShowDivisionDropdown}
          items={divisions}
          onSelect={handleDivisionSelect}
          loading={loadingDivisions}
          hasNext={!!divisionsNextUrl}
          loadMore={loadMoreDivisions}
          scrollRef={divisionScrollRef}
        />

        <LocationDropdown
          label="District"
          placeholder="Select District"
          searchValue={districtSearch}
          setSearchValue={setDistrictSearch}
          selectedName={getSelectedDistrictName()}
          showDropdown={showDistrictDropdown}
          setShowDropdown={setShowDistrictDropdown}
          items={districts}
          onSelect={handleDistrictSelect}
          loading={loadingDistricts}
          hasNext={!!districtsNextUrl}
          loadMore={loadMoreDistricts}
          scrollRef={districtScrollRef}
          disabled={!formData.division_id}
        />

        <LocationDropdown
          label="Upazila"
          placeholder="Select Upazila"
          searchValue={upazilaSearch}
          setSearchValue={setUpazilaSearch}
          selectedName={getSelectedUpazilaName()}
          showDropdown={showUpazilaDropdown}
          setShowDropdown={setShowUpazilaDropdown}
          items={upazilas}
          onSelect={handleUpazilaSelect}
          loading={loadingUpazilas}
          hasNext={!!upazilasNextUrl}
          loadMore={loadMoreUpazilas}
          scrollRef={upazilaScrollRef}
          disabled={!formData.preferred_district_id}
        />

        <LocationDropdown
          label="Area"
          placeholder="Select Area"
          searchValue={areaSearch}
          setSearchValue={setAreaSearch}
          selectedName={getSelectedAreaName()}
          showDropdown={showAreaDropdown}
          setShowDropdown={setShowAreaDropdown}
          items={areas}
          onSelect={handleAreaSelect}
          loading={loadingAreas}
          hasNext={!!areasNextUrl}
          loadMore={loadMoreAreas}
          scrollRef={areaScrollRef}
          disabled={!formData.preferred_upazila_id}
        />
      </div>

      <div>
        <Label htmlFor="address" className="text-foreground flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          Full Address
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleAddressChange}
          placeholder="Enter your complete address..."
          className="bg-background/50 border-border text-foreground focus:border-ring transition-colors"
        />
      </div>
    </div>
  );
};