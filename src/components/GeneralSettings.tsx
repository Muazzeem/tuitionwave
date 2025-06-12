import { useUserProfile, ProfileData } from '@/contexts/UserProfileContext';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { Camera, User, X, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const GeneralSettings = () => {
  const { profile, updateProfile, loading, refreshProfile } = useUserProfile();
  const { userProfile, fetchProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Location data states
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  // Search states
  const [divisionSearch, setDivisionSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [upazilaSearch, setUpazilaSearch] = useState('');

  // Dropdown states
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showUpazilaDropdown, setShowUpazilaDropdown] = useState(false);

  const [formData, setFormData] = useState<Partial<ProfileData & {
    division_id: number | null;
    preferred_district_id: number | null;
    preferred_upazila_id: number | null;
  }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    user_type: '',
    profile_picture: null,
    is_nid_verified: false,
    division_id: null,
    preferred_district_id: null,
    preferred_upazila_id: null
  });

  // Fetch divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (formData.division_id) {
      fetchDistricts(formData.division_id);
    } else {
      setDistricts([]);
      setUpazilas([]);
      setFormData(prev => ({ ...prev, preferred_district_id: null, preferred_upazila_id: null }));
    }
  }, [formData.division_id]);

  // Fetch upazilas when preferred district changes
  useEffect(() => {
    if (formData.preferred_district_id) {
      fetchUpazilas(formData.preferred_district_id);
    } else {
      setUpazilas([]);
      setFormData(prev => ({ ...prev, preferred_upazila_id: null }));
    }
  }, [formData.preferred_district_id]);

  const fetchDivisions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/divisions/`);
      const data = await response.json();
      setDivisions(data.results || []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load divisions.',
        variant: 'destructive',
      });
    }
  };

  const fetchDistricts = async (divisionId: number, search = '') => {
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/districts/?division=${divisionId}${searchParam}`);
      const data = await response.json();
      setDistricts(data.results || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load districts.',
        variant: 'destructive',
      });
    }
  };

  const fetchUpazilas = async (districtId: number, search = '') => {
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upazilas/?district=${districtId}${searchParam}`);
      const data = await response.json();
      setUpazilas(data.results || []);
    } catch (error) {
      console.error('Error fetching upazilas:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upazilas.',
        variant: 'destructive',
      });
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.division_id && districtSearch !== '') {
        fetchDistricts(formData.division_id, districtSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [districtSearch, formData.division_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.preferred_district_id && upazilaSearch !== '') {
        fetchUpazilas(formData.preferred_district_id, upazilaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [upazilaSearch, formData.preferred_district_id]);

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
        user_type: profile.user_type || '',
        profile_picture: profile.profile_picture || null,
        is_nid_verified: profile.is_nid_verified || false,
        division_id: profile.division?.id || null,
        preferred_district_id: profile.preferred_districts?.[0]?.id || null,
        preferred_upazila_id: profile.preferred_upazila?.[0]?.id || null
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

  const handleDivisionSelect = (division: Division) => {
    setFormData(prev => ({
      ...prev,
      division_id: division.id,
      preferred_district_id: null,
      preferred_upazila_id: null
    }));
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
  };

  const handleDistrictSelect = (district: District) => {
    setFormData(prev => ({
      ...prev,
      preferred_district_id: district.id,
      preferred_upazila_id: null
    }));
    setDistrictSearch(district.name);
    setShowDistrictDropdown(false);
  };

  const handleUpazilaSelect = (upazila: Upazila) => {
    setFormData(prev => ({
      ...prev,
      preferred_upazila_id: upazila.id
    }));
    setUpazilaSearch(upazila.name);
    setShowUpazilaDropdown(false);
  };

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

  const filteredDivisions = divisions.filter(division =>
    division.name.toLowerCase().includes(divisionSearch.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredUpazilas = upazilas.filter(upazila =>
    upazila.name.toLowerCase().includes(upazilaSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const submitData = new FormData();

      submitData.append('first_name', formData.first_name || '');
      submitData.append('last_name', formData.last_name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');
      submitData.append('user_type', formData.user_type || '');

      // Add location fields as arrays to match backend expectation
      if (formData.division_id) {
        submitData.append('division', formData.division_id.toString());
      }

      if (formData.preferred_district_id) {
        submitData.append('preferred_districts', formData.preferred_district_id.toString());
      }

      if (formData.preferred_upazila_id) {
        submitData.append('preferred_upazila', formData.preferred_upazila_id.toString());
      }

      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      } else if (formData.profile_picture === null) {
        submitData.append('profile_picture', '');
      }

      // DEBUG
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
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
    <div className="p-6 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-gray-600">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{previewUrl ? 'Change Picture' : 'Upload Picture'}</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-sm text-gray-500 text-center">
            Supported formats: JPG, PNG, GIF<br />
            Maximum size: 5MB
          </p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        {/* Location Fields */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold">Location Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Division Selection */}
            <div className="relative">
              <Label>Division</Label>
              <div className="relative mt-1">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-600"
                  onClick={() => setShowDivisionDropdown(!showDivisionDropdown)}
                >
                  <span className={getSelectedDivisionName() ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                    {getSelectedDivisionName() || 'Select Division'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                {showDivisionDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search divisions..."
                          value={divisionSearch}
                          onChange={(e) => setDivisionSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredDivisions.map((division) => (
                        <div
                          key={division.id}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleDivisionSelect(division)}
                        >
                          {division.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* District Selection */}
            {formData.division_id && (
              <div className="relative">
                <Label>District</Label>
                <div className="relative mt-1">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-600"
                    onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                  >
                    <span className={getSelectedDistrictName() ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                      {getSelectedDistrictName() || 'Select District'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  {showDistrictDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search districts..."
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredDistricts.map((district) => (
                          <div
                            key={district.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleDistrictSelect(district)}
                          >
                            {district.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upazila Selection */}
            {formData.preferred_district_id && (
              <div className="relative">
                <Label>Upazila</Label>
                <div className="relative mt-1">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-600"
                    onClick={() => setShowUpazilaDropdown(!showUpazilaDropdown)}
                  >
                    <span className={getSelectedUpazilaName() ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                      {getSelectedUpazilaName() || 'Select Upazila'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  {showUpazilaDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search upazilas..."
                            value={upazilaSearch}
                            onChange={(e) => setUpazilaSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredUpazilas.map((upazila) => (
                          <div
                            key={upazila.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleUpazilaSelect(upazila)}
                          >
                            {upazila.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="dark:text-white">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
