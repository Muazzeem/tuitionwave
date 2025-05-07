
import React, { useEffect } from "react";
import FormField from "./FormField";

interface City {
  id: number;
  name: string;
  district: {
    id: number;
    name: string;
    division: {
      id: number;
      name: string;
    }
  }
}

interface Area {
  id: number;
  name: string;
}

interface LocationFieldsProps {
  studentCity: string;
  studentArea: string;
  onCityChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  cities: City[];
  areas: Area[];
  filteredAreas: Area[];
  loadingCities: boolean;
  loadingAreas: boolean;
  cityError?: string;
  areaError?: string;
}

const LocationFields: React.FC<LocationFieldsProps> = ({
  studentCity,
  studentArea,
  onCityChange,
  onAreaChange,
  cities,
  areas,
  filteredAreas,
  loadingCities,
  loadingAreas,
  cityError,
  areaError,
}) => {
  const cityOptions = cities.map(city => ({
    value: city.id.toString(),
    label: city.name
  }));

  const areaOptions = filteredAreas.map(area => ({
    value: area.id.toString(),
    label: area.name
  }));

  const getAreaPlaceholder = () => {
    if (loadingAreas) return "Loading areas...";
    if (!studentCity) return "Select a city first";
    if (filteredAreas.length === 0) return "No areas available";
    return "Select Area";
  };
  
  return (
    <>
      <div className="col-span-6">
        <FormField
          id="studentCity"
          label="Student City"
          type="select"
          value={studentCity}
          onChange={onCityChange}
          placeholder={loadingCities ? "Loading cities..." : "Select City"}
          error={cityError}
          required
          disabled={loadingCities}
          options={cityOptions}
        />
      </div>
      <div className="col-span-6">
        <FormField
          id="studentArea"
          label="Area"
          type="select"
          value={studentArea}
          onChange={onAreaChange}
          placeholder={getAreaPlaceholder()}
          error={areaError}
          required
          disabled={loadingAreas || !studentCity}
          options={areaOptions}
        />
      </div>
    </>
  );
};

export default LocationFields;
