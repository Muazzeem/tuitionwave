import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Division, District, Upazila } from '@/types/common';

interface Area {
  id: number;
  name: string;
  upazila: number;
}

interface InfiniteScrollData<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface UseInfiniteLocationDataReturn {
  // Data
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  areas: Area[];
  
  // Loading states
  loadingDivisions: boolean;
  loadingDistricts: boolean;
  loadingUpazilas: boolean;
  loadingAreas: boolean;
  
  // Search states
  divisionSearch: string;
  setDivisionSearch: (value: string) => void;
  districtSearch: string;
  setDistrictSearch: (value: string) => void;
  upazilaSearch: string;
  setUpazilaSearch: (value: string) => void;
  areaSearch: string;
  setAreaSearch: (value: string) => void;
  
  // Dropdown states
  showDivisionDropdown: boolean;
  setShowDivisionDropdown: (show: boolean) => void;
  showDistrictDropdown: boolean;
  setShowDistrictDropdown: (show: boolean) => void;
  showUpazilaDropdown: boolean;
  setShowUpazilaDropdown: (show: boolean) => void;
  showAreaDropdown: boolean;
  setShowAreaDropdown: (show: boolean) => void;
  
  // Scroll refs
  divisionScrollRef: React.RefObject<HTMLDivElement>;
  districtScrollRef: React.RefObject<HTMLDivElement>;
  upazilaScrollRef: React.RefObject<HTMLDivElement>;
  areaScrollRef: React.RefObject<HTMLDivElement>;
  
  // Next URLs for pagination
  divisionsNextUrl: string | null;
  districtsNextUrl: string | null;
  upazilasNextUrl: string | null;
  areasNextUrl: string | null;
  
  // Fetch functions
  fetchDivisions: (search?: string, append?: boolean) => Promise<void>;
  fetchDistricts: (divisionId: number, search?: string, append?: boolean) => Promise<void>;
  fetchUpazilas: (districtId: number, search?: string, append?: boolean) => Promise<void>;
  fetchAreas: (upazilaId: number, search?: string, append?: boolean) => Promise<void>;
  
  // Load more functions
  loadMoreDivisions: () => Promise<void>;
  loadMoreDistricts: () => Promise<void>;
  loadMoreUpazilas: () => Promise<void>;
  loadMoreAreas: () => Promise<void>;
  
  // Clear functions
  clearDependentData: (level: 'districts' | 'upazilas' | 'areas') => void;
}

export const useInfiniteLocationData = (): UseInfiniteLocationDataReturn => {
  const { toast } = useToast();
  
  // Data states
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  // Pagination states
  const [divisionsNextUrl, setDivisionsNextUrl] = useState<string | null>(null);
  const [districtsNextUrl, setDistrictsNextUrl] = useState<string | null>(null);
  const [upazilasNextUrl, setUpazilasNextUrl] = useState<string | null>(null);
  const [areasNextUrl, setAreasNextUrl] = useState<string | null>(null);
  
  // Loading states
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  
  // Search states
  const [divisionSearch, setDivisionSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [upazilaSearch, setUpazilaSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  
  // Dropdown states
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showUpazilaDropdown, setShowUpazilaDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  
  // Scroll refs
  const divisionScrollRef = useRef<HTMLDivElement>(null);
  const districtScrollRef = useRef<HTMLDivElement>(null);
  const upazilaScrollRef = useRef<HTMLDivElement>(null);
  const areaScrollRef = useRef<HTMLDivElement>(null);
  
  // Generic fetch function with infinite scroll support
  const fetchData = async <T,>(
    url: string,
    setData: React.Dispatch<React.SetStateAction<T[]>>,
    setNextUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    append = false
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: InfiniteScrollData<T> = await response.json();

      if (append) {
        setData(prev => [...prev, ...(data.results || [])]);
      } else {
        setData(data.results || []);
      }
      setNextUrl(data.next);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load location data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch functions with infinite scroll
  const fetchDivisions = useCallback(async (search = '', append = false) => {
    const baseUrl = `${import.meta.env.VITE_API_URL || ''}/api/divisions/`;
    const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
    await fetchData<Division>(
      `${baseUrl}${searchParam}`,
      setDivisions,
      setDivisionsNextUrl,
      setLoadingDivisions,
      append
    );
  }, [toast]);

  const fetchDistricts = useCallback(async (divisionId: number, search = '', append = false) => {
    const baseUrl = `${import.meta.env.VITE_API_URL || ''}/api/districts/`;
    const params = new URLSearchParams({ division: divisionId.toString() });
    if (search) params.append('search', search);

    await fetchData<District>(
      `${baseUrl}?${params.toString()}`,
      setDistricts,
      setDistrictsNextUrl,
      setLoadingDistricts,
      append
    );
  }, [toast]);

  const fetchUpazilas = useCallback(async (districtId: number, search = '', append = false) => {
    const baseUrl = `${import.meta.env.VITE_API_URL || ''}/api/upazilas/`;
    const params = new URLSearchParams({ district: districtId.toString() });
    if (search) params.append('search', search);

    await fetchData<Upazila>(
      `${baseUrl}?${params.toString()}`,
      setUpazilas,
      setUpazilasNextUrl,
      setLoadingUpazilas,
      append
    );
  }, [toast]);

  const fetchAreas = useCallback(async (upazilaId: number, search = '', append = false) => {
    const baseUrl = `${import.meta.env.VITE_API_URL || ''}/api/areas/`;
    const params = new URLSearchParams({ upazila: upazilaId.toString() });
    if (search) params.append('search', search);

    await fetchData<Area>(
      `${baseUrl}?${params.toString()}`,
      setAreas,
      setAreasNextUrl,
      setLoadingAreas,
      append
    );
  }, [toast]);

  // Load more functions
  const loadMoreDivisions = useCallback(async () => {
    if (divisionsNextUrl && !loadingDivisions) {
      await fetchData<Division>(divisionsNextUrl, setDivisions, setDivisionsNextUrl, setLoadingDivisions, true);
    }
  }, [divisionsNextUrl, loadingDivisions]);

  const loadMoreDistricts = useCallback(async () => {
    if (districtsNextUrl && !loadingDistricts) {
      await fetchData<District>(districtsNextUrl, setDistricts, setDistrictsNextUrl, setLoadingDistricts, true);
    }
  }, [districtsNextUrl, loadingDistricts]);

  const loadMoreUpazilas = useCallback(async () => {
    if (upazilasNextUrl && !loadingUpazilas) {
      await fetchData<Upazila>(upazilasNextUrl, setUpazilas, setUpazilasNextUrl, setLoadingUpazilas, true);
    }
  }, [upazilasNextUrl, loadingUpazilas]);

  const loadMoreAreas = useCallback(async () => {
    if (areasNextUrl && !loadingAreas) {
      await fetchData<Area>(areasNextUrl, setAreas, setAreasNextUrl, setLoadingAreas, true);
    }
  }, [areasNextUrl, loadingAreas]);

  // Clear dependent data function
  const clearDependentData = useCallback((level: 'districts' | 'upazilas' | 'areas') => {
    switch (level) {
      case 'districts':
        setDistricts([]);
        setUpazilas([]);
        setAreas([]);
        setDistrictSearch('');
        setUpazilaSearch('');
        setAreaSearch('');
        break;
      case 'upazilas':
        setUpazilas([]);
        setAreas([]);
        setUpazilaSearch('');
        setAreaSearch('');
        break;
      case 'areas':
        setAreas([]);
        setAreaSearch('');
        break;
    }
  }, []);

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
  };
};