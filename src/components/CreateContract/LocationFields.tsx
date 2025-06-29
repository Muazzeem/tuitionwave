import React from "react";
import FormField from "./FormField";
import {Division, District, Upazila} from "@/types/common";

interface Area {
  id: number;
  name: string;
}

interface LocationFieldsProps {
  // Selected values
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedArea: string;
  
  // Change handlers
  onDivisionChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onUpazilaChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  
  // Data arrays
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  areas: Area[];
  
  // Loading states
  loadingDivisions: boolean;
  loadingDistricts: boolean;
  loadingUpazilas: boolean;
  loadingAreas: boolean;
  
  // Error states (optional)
  divisionError?: string;
  districtError?: string;
  upazilaError?: string;
  areaError?: string;
  
  // Required fields (optional)
  divisionRequired?: boolean;
  districtRequired?: boolean;
  upazilaRequired?: boolean;
  areaRequired?: boolean;
}

const LocationFields: React.FC<LocationFieldsProps> = ({
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedArea,
  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  onAreaChange,
  divisions,
  districts,
  upazilas,
  areas,
  loadingDivisions,
  loadingDistricts,
  loadingUpazilas,
  loadingAreas,
  divisionError,
  districtError,
  upazilaError,
  areaError,
  divisionRequired = false,
  districtRequired = false,
  upazilaRequired = false,
  areaRequired = false,
}) => {
  // Transform data to options format
  const divisionOptions = divisions?.map(division => ({
    value: division.id.toString(),
    label: division.name
  }));

  const districtOptions = districts?.map(district => ({
    value: district.id.toString(),
    label: district.name
  }));

  const upazilaOptions = upazilas?.map(upazila => ({
    value: upazila.id.toString(),
    label: upazila.name
  }));

  const areaOptions = areas?.map(area => ({
    value: area.id.toString(),
    label: area.name
  }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-3">
          <FormField
            id="division"
            label="Division"
            type="select"
            value={selectedDivision}
            onChange={onDivisionChange}
            placeholder={loadingDivisions ? "Loading divisions..." : "Select Division"}
            error={divisionError}
            required={divisionRequired}
            disabled={loadingDivisions}
            options={divisionOptions}
          />
        </div>

        {/* District Field */}
        <div className="mb-3">
          <FormField
            id="district"
            label="District"
            type="select"
            value={selectedDistrict}
            onChange={onDistrictChange}
            placeholder={
              loadingDistricts 
                ? "Loading districts..." 
                : !selectedDivision 
                  ? "Select Division first" 
                  : "Select District"
            }
            error={districtError}
            required={districtRequired}
            disabled={loadingDistricts || !selectedDivision}
            options={districtOptions}
          />
        </div>

        {/* Upazila Field */}
        <div className="mb-3">
          <FormField
            id="upazila"
            label="Upazila"
            type="select"
            value={selectedUpazila}
            onChange={onUpazilaChange}
            placeholder={
              loadingUpazilas 
                ? "Loading upazilas..." 
                : !selectedDistrict 
                  ? "Select District first" 
                  : "Select Upazila"
            }
            error={upazilaError}
            required={upazilaRequired}
            disabled={loadingUpazilas || !selectedDistrict}
            options={upazilaOptions}
          />
        </div>
      </div>

      {/* Area Field */}
      <div className="col-span-6 mb-3">
        <FormField
          id="area"
          label="Area"
          type="select"
          value={selectedArea}
          onChange={onAreaChange}
          placeholder={
            loadingAreas 
              ? "Loading areas..." 
              : !selectedUpazila 
                ? "Select Upazila first" 
                : "Select Area"
          }
          error={areaError}
          required={areaRequired}
          disabled={loadingAreas || !selectedUpazila}
          options={areaOptions}
        />
      </div>
      
    </>
  );
};

export default LocationFields;