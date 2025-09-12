import { useUserProfile, ProfileData } from '@/contexts/UserProfileContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { Camera, User, X, Search, ChevronDown, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

const GeneralSettings = () => {
  const { profile, updateProfile, loading, refreshProfile } = useUserProfile();
  const { fetchProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Location data states with pagination
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

  // Scroll refs for infinite scroll
  const divisionScrollRef = useRef<HTMLDivElement>(null);
  const districtScrollRef = useRef<HTMLDivElement>(null);
  const upazilaScrollRef = useRef<HTMLDivElement>(null);
  const areaScrollRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<ProfileData & {
    division_id: number | null;
    preferred_district_id: number | null;
    preferred_upazila_id: number | null;
    preferred_area_id: number | null;
  }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: null,
    is_nid_verified: false,
    division_id: null,
    preferred_district_id: null,
    preferred_upazila_id: null,
    preferred_area_id: null
  });

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
        description: 'Failed to load data.',
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
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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

  // Infinite scroll handlers
  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    loadMore: () => void,
    hasNext: boolean,
    isLoading: boolean
  ) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

    if (isNearBottom && hasNext && !isLoading) {
      loadMore();
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  // Handle cascading data fetch
  useEffect(() => {
    if (formData.division_id) {
      fetchDistricts(formData.division_id);
    } else {
      setDistricts([]);
      setUpazilas([]);
      setAreas([]);
      setFormData(prev => ({
        ...prev,
        preferred_district_id: null,
        preferred_upazila_id: null,
        preferred_area_id: null
      }));
    }
  }, [formData.division_id, fetchDistricts]);

  useEffect(() => {
    if (formData.preferred_district_id) {
      fetchUpazilas(formData.preferred_district_id);
    } else {
      setUpazilas([]);
      setAreas([]);
      setFormData(prev => ({
        ...prev,
        preferred_upazila_id: null,
        preferred_area_id: null
      }));
    }
  }, [formData.preferred_district_id, fetchUpazilas]);

  useEffect(() => {
    if (formData.preferred_upazila_id) {
      fetchAreas(formData.preferred_upazila_id);
    } else {
      setAreas([]);
      setFormData(prev => ({ ...prev, preferred_area_id: null }));
    }
  }, [formData.preferred_upazila_id, fetchAreas]);

  // Search handlers with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (divisionSearch !== '' || divisionSearch === '') {
        fetchDivisions(divisionSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [divisionSearch, fetchDivisions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.division_id && (districtSearch !== '' || districtSearch === '')) {
        fetchDistricts(formData.division_id, districtSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [districtSearch, formData.division_id, fetchDistricts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.preferred_district_id && (upazilaSearch !== '' || upazilaSearch === '')) {
        fetchUpazilas(formData.preferred_district_id, upazilaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [upazilaSearch, formData.preferred_district_id, fetchUpazilas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.preferred_upazila_id && (areaSearch !== '' || areaSearch === '')) {
        fetchAreas(formData.preferred_upazila_id, areaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [areaSearch, formData.preferred_upazila_id, fetchAreas]);

  useEffect(() => {
    refreshProfile();
  }, [location.pathname]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        profile_picture: profile.profile_picture || null,
        is_nid_verified: profile.is_nid_verified || false,
        division_id: profile.division?.id || null,
        preferred_district_id: profile.preferred_districts?.[0]?.id || null,
        preferred_upazila_id: profile.preferred_upazila?.[0]?.id || null,
        preferred_area_id: profile.preferred_area?.id || null
      });

      if (profile.profile_picture && typeof profile.profile_picture === 'string') {
        setPreviewUrl(profile.profile_picture);
      }

      // Set search values to display selected names
      if (profile.division) {
        setDivisionSearch(profile.division.name);
      }
      if (profile.preferred_districts?.[0]) {
        setDistrictSearch(profile.preferred_districts[0].name);
      }
      if (profile.preferred_upazila?.[0]) {
        setUpazilaSearch(profile.preferred_upazila[0].name);
      }
      if (profile.preferred_area) {
        setAreaSearch(profile.preferred_area.name);
      }
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, profile_picture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Selection handlers
  const handleDivisionSelect = (division: Division) => {
    setFormData(prev => ({
      ...prev,
      division_id: division.id,
      preferred_district_id: null,
      preferred_upazila_id: null,
      preferred_area_id: null
    }));
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
    setDistrictSearch('');
    setUpazilaSearch('');
    setAreaSearch('');
  };

  const handleDistrictSelect = (district: District) => {
    setFormData(prev => ({
      ...prev,
      preferred_district_id: district.id,
      preferred_upazila_id: null,
      preferred_area_id: null
    }));
    setDistrictSearch(district.name);
    setShowDistrictDropdown(false);
    setUpazilaSearch('');
    setAreaSearch('');
  };

  const handleUpazilaSelect = (upazila: Upazila) => {
    setFormData(prev => ({
      ...prev,
      preferred_upazila_id: upazila.id,
      preferred_area_id: null
    }));
    setUpazilaSearch(upazila.name);
    setShowUpazilaDropdown(false);
    setAreaSearch('');
  };

  const handleAreaSelect = (area: Area) => {
    setFormData(prev => ({
      ...prev,
      preferred_area_id: area.id
    }));
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

  // Filter functions
  const filteredDivisions = divisions.filter(division =>
    division.name.toLowerCase().includes(divisionSearch.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredUpazilas = upazilas.filter(upazila =>
    upazila.name.toLowerCase().includes(upazilaSearch.toLowerCase())
  );

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  // Enhanced dropdown component
  const LocationDropdown = ({
    label,
    placeholder,
    searchValue,
    setSearchValue,
    selectedName,
    showDropdown,
    setShowDropdown,
    items,
    onSelect,
    loading,
    hasNext,
    loadMore,
    scrollRef
  }: {
    label: string;
    placeholder: string;
    searchValue: string;
    setSearchValue: (value: string) => void;
    selectedName: string;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    items: any[];
    onSelect: (item: any) => void;
    loading: boolean;
    hasNext: boolean;
    loadMore: () => void;
    scrollRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="relative">
      <Label className="text-white flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {label}
      </Label>
      <div className="relative mt-1">
        <div
          className="w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between bg-gray-800/50 border-gray-600 hover:border-gray-500 transition-colors backdrop-blur-sm"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className={selectedName ? 'text-gray-100' : 'text-gray-400'}>
            {selectedName || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </div>
        {showDropdown && (
          <div className="absolute z-20 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl">
            <div className="p-3 border-b border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>
            <div
              ref={scrollRef}
              className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              onScroll={(e) => handleScroll(e, loadMore, hasNext, loading)}
            >
              {items.length === 0 && !loading ? (
                <div className="px-4 py-6 text-center text-gray-400">
                  No {label.toLowerCase()} found
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer transition-colors flex items-center gap-3 text-gray-100"
                      onClick={() => onSelect(item)}
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {item.name}
                    </div>
                  ))}
                  {loading && (
                    <div className="px-4 py-3 text-center text-gray-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.phone) {
        toast({
          title: 'Validation Error',
          description: 'Phone number is required.',
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);

      const submitData = new FormData();

      submitData.append('first_name', formData.first_name || '');
      submitData.append('last_name', formData.last_name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');

      // Add location fields
      if (formData.division_id) {
        submitData.append('division', formData.division_id.toString());
      }

      if (formData.preferred_district_id) {
        submitData.append('preferred_districts', formData.preferred_district_id.toString());
      }

      if (formData.preferred_upazila_id) {
        submitData.append('preferred_upazila', formData.preferred_upazila_id.toString());
      }

      if (formData.preferred_area_id) {
        submitData.append('preferred_area', formData.preferred_area_id.toString());
      }

      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      } else if (formData.profile_picture === null) {
        submitData.append('profile_picture', '');
      }

      await updateProfile(submitData);

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            General Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Enhanced Profile Picture Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 px-6 py-2 rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{previewUrl ? 'Change Picture' : 'Upload Picture'}</span>
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-sm text-gray-400 text-center">
                Supported formats: JPG, PNG, GIF • Maximum size: 5MB
              </p>
            </div>

            {/* Enhanced Basic Information */}
            <div className="bg-gray-700/20 rounded-xl p-6 border border-gray-600/30">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first_name" className="text-white">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    className="mt-1 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-white">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    className="mt-1 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 border-gray-600 bg-gray-700/50 text-gray-400"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder='+880123456789'
                    className="mt-1 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Location Preferences */}
            <div className="bg-gray-700/20 rounded-xl p-6 border border-gray-600/30">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
                  items={filteredDivisions}
                  onSelect={handleDivisionSelect}
                  loading={loadingDivisions}
                  hasNext={!!divisionsNextUrl}
                  loadMore={loadMoreDivisions}
                  scrollRef={divisionScrollRef}
                />

                {formData.division_id && (
                  <LocationDropdown
                    label="District"
                    placeholder="Select District"
                    searchValue={districtSearch}
                    setSearchValue={setDistrictSearch}
                    selectedName={getSelectedDistrictName()}
                    showDropdown={showDistrictDropdown}
                    setShowDropdown={setShowDistrictDropdown}
                    items={filteredDistricts}
                    onSelect={handleDistrictSelect}
                    loading={loadingDistricts}
                    hasNext={!!districtsNextUrl}
                    loadMore={loadMoreDistricts}
                    scrollRef={districtScrollRef}
                  />
                )}

                {formData.preferred_district_id && (
                  <LocationDropdown
                    label="Upazila"
                    placeholder="Select Upazila"
                    searchValue={upazilaSearch}
                    setSearchValue={setUpazilaSearch}
                    selectedName={getSelectedUpazilaName()}
                    showDropdown={showUpazilaDropdown}
                    setShowDropdown={setShowUpazilaDropdown}
                    items={filteredUpazilas}
                    onSelect={handleUpazilaSelect}
                    loading={loadingUpazilas}
                    hasNext={!!upazilasNextUrl}
                    loadMore={loadMoreUpazilas}
                    scrollRef={upazilaScrollRef}
                  />
                )}

                {formData.preferred_upazila_id && (
                  <LocationDropdown
                    label="Area"
                    placeholder="Select Area"
                    searchValue={areaSearch}
                    setSearchValue={setAreaSearch}
                    selectedName={getSelectedAreaName()}
                    showDropdown={showAreaDropdown}
                    setShowDropdown={setShowAreaDropdown}
                    items={filteredAreas}
                    onSelect={handleAreaSelect}
                    loading={loadingAreas}
                    hasNext={!!areasNextUrl}
                    loadMore={loadMoreAreas}
                    scrollRef={areaScrollRef}
                  />
                )}
              </div>

              <div className="mt-6">
                <Label htmlFor="address" className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Full Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="Enter your complete address..."
                  className="mt-1 border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Enhanced Submit Section */}
            <div className="flex justify-end pt-6 border-t border-gray-600/30">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 3px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1f2937;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default GeneralSettings;