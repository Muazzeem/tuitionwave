
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export const useLocationData = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [studentCity, setStudentCity] = useState<string>("");
  const [studentArea, setStudentArea] = useState<string>("");
  
  const { toast } = useToast();

  // Fetch cities from API
  const fetchCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cities/");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCities(data.results || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Error",
        description: "Failed to load cities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCities(false);
    }
  }, [toast]);

  // Fetch areas from API
  const fetchAreas = useCallback(async () => {
    setLoadingAreas(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/areas/");
      if (!response.ok) {
        throw new Error("Failed to fetch areas");
      }
      const data = await response.json();
      setAreas(data.results || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast({
        title: "Error",
        description: "Failed to load areas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAreas(false);
    }
  }, [toast]);

  // Filter areas based on selected city
  useEffect(() => {
    if (studentCity && areas.length > 0) {
      const selectedCityObj = cities.find(city => city.id.toString() === studentCity);
      if (selectedCityObj) {
        const areasForCity = areas.filter(area => area.id.toString() === studentArea);
        setFilteredAreas(areasForCity);
      } else {
        setFilteredAreas([]);
      }
    } else {
      setFilteredAreas([]);
    }
    // Reset selected area when city changes
    if (studentCity) {
      setStudentArea("");
    }
  }, [studentCity, areas, cities]);

  // Update student city and area
  const handleCityChange = (value: string) => {
    setStudentCity(value);
  };

  const handleAreaChange = (value: string) => {
    setStudentArea(value);
  };

  return {
    cities,
    areas,
    filteredAreas,
    loadingCities,
    loadingAreas,
    studentCity,
    studentArea,
    fetchCities,
    fetchAreas,
    handleCityChange,
    handleAreaChange
  };
};
