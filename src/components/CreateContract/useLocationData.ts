import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  }
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
    }
  }
}

interface Area {
  id: number;
  name: string;
}

export const useLocationData = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  const [loadingDivisions, setLoadingDivisions] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  
  const { toast } = useToast();

  // Fetch divisions from API
  const fetchDivisions = useCallback(async () => {
    setLoadingDivisions(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/divisions/`);
      if (!response.ok) {
        throw new Error("Failed to fetch divisions");
      }
      const data = await response.json();
      setDivisions(data.results || []);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      toast({
        title: "Error",
        description: "Failed to load divisions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDivisions(false);
    }
  }, [toast]);

  // Fetch districts from API based on selected division
  const fetchDistricts = useCallback(async (divisionId?: string) => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    
    setLoadingDistricts(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/districts/?division=${divisionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch districts");
      }
      const data = await response.json();
      setDistricts(data.results || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast({
        title: "Error",
        description: "Failed to load districts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDistricts(false);
    }
  }, [toast]);

  // Fetch upazilas from API based on selected district
  const fetchUpazilas = useCallback(async (districtId?: string) => {
    if (!districtId) {
      setUpazilas([]);
      return;
    }
    
    setLoadingUpazilas(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upazilas/?district=${districtId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch upazilas");
      }
      const data = await response.json();
      setUpazilas(data.results || []);
    } catch (error) {
      console.error("Error fetching upazilas:", error);
      toast({
        title: "Error",
        description: "Failed to load upazilas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingUpazilas(false);
    }
  }, [toast]);

  // Fetch areas from API based on selected upazila
  const fetchAreas = useCallback(async (upazilaId?: string) => {
    if (!upazilaId) {
      setAreas([]);
      return;
    }
    
    setLoadingAreas(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/areas/?upazila=${upazilaId}`);
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

  // Handle division change
  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict("");
    setSelectedUpazila("");
    setSelectedArea("");
    
    // Clear dependent data
    setDistricts([]);
    setUpazilas([]);
    setAreas([]);
    
    // Fetch districts for selected division
    fetchDistricts(value);
  };

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedUpazila("");
    setSelectedArea("");
    
    // Clear dependent data
    setUpazilas([]);
    setAreas([]);
    
    // Fetch upazilas for selected district
    fetchUpazilas(value);
  };

  // Handle upazila change
  const handleUpazilaChange = (value: string) => {
    setSelectedUpazila(value);
    setSelectedArea("");
    
    // Clear dependent data
    setAreas([]);
    
    // Fetch areas for selected upazila
    fetchAreas(value);
  };

  // Handle area change
  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedUpazila("");
    setSelectedArea("");
    setDistricts([]);
    setUpazilas([]);
    setAreas([]);
  };

  return {
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
    
    // Selected values
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedArea,
    
    // Fetch functions
    fetchDivisions,
    fetchDistricts,
    fetchUpazilas,
    fetchAreas,
    
    // Handler functions
    handleDivisionChange,
    handleDistrictChange,
    handleUpazilaChange,
    handleAreaChange,
    
    // Utility functions
    resetSelections
  };
};