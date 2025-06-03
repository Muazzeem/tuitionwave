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
    division: number | null;
    preferred_districts: number[];
    preferred_upazila: number[];
  }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    user_type: '',
    profile_picture: null,
    is_nid_verified: false,
    division: null,
    preferred_districts: [],
    preferred_upazila: []
  });

  // Fetch divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (formData.division) {
      fetchDistricts(formData.division);
    } else {
      setDistricts([]);
      setUpazilas([]);
      setFormData(prev => ({ ...prev, preferred_districts: [], preferred_upazila: [] }));
    }
  }, [formData.division]);

  // Fetch upazilas when preferred districts change
  useEffect(() => {
    if (formData.preferred_districts && formData.preferred_districts.length > 0) {
      fetchUpazilas(formData.preferred_districts);
    } else {
      setUpazilas([]);
      setFormData(prev => ({ ...prev, preferred_upazila: [] }));
    }
  }, [formData.preferred_districts]);

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

  const fetchDistricts = async (divisionId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/districts/?division=${divisionId}`);
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

  const fetchUpazilas = async (districtIds: number[]) => {
    try {
      const promises = districtIds.map(districtId =>
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/upazilas/?district=${districtId}`)
          .then(res => res.json())
      );
      const results = await Promise.all(promises);
      const allUpazilas = results.flatMap(result => result.results || []);
      setUpazilas(allUpazilas);
    } catch (error) {
      console.error('Error fetching upazilas:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upazilas.',
        variant: 'destructive',
      });
    }
  };

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
        division: profile.division || null,
        preferred_districts: profile.preferred_districts || [],
        preferred_upazila: profile.preferred_upazila || []
      });

      if (profile.profile_picture && typeof profile.profile_picture === 'string') {
        setPreviewUrl(profile.profile_picture);
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
    setFormData(prev => ({ ...prev, division: division.id }));
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
  };

  const handleDistrictToggle = (districtId: number) => {
    setFormData(prev => {
      const currentDistricts = prev.preferred_districts || [];
      const newDistricts = currentDistricts.includes(districtId)
        ? currentDistricts.filter(id => id !== districtId)
        : [...currentDistricts, districtId];
      return { ...prev, preferred_districts: newDistricts };
    });
  };

  const handleUpazilaToggle = (upazilaId: number) => {
    setFormData(prev => {
      const currentUpazilas = prev.preferred_upazila || [];
      const newUpazilas = currentUpazilas.includes(upazilaId)
        ? currentUpazilas.filter(id => id !== upazilaId)
        : [...currentUpazilas, upazilaId];
      return { ...prev, preferred_upazila: newUpazilas };
    });
  };

  const getSelectedDivisionName = () => {
    const selectedDivision = divisions.find(d => d.id === formData.division);
    return selectedDivision ? selectedDivision.name : '';
  };

  const getSelectedDistrictsNames = () => {
    const selectedDistricts = districts.filter(d => formData.preferred_districts?.includes(d.id));
    return selectedDistricts.map(d => d.name).join(', ');
  };

  const getSelectedUpazilasNames = () => {
    const selectedUpazilas = upazilas.filter(u => formData.preferred_upazila?.includes(u.id));
    return selectedUpazilas.map(u => u.name).join(', ');
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
      
      // Add new fields
      if (formData.division) {
        submitData.append('division', formData.division.toString());
      }
      
      if (formData.preferred_districts) {
        formData.preferred_districts.forEach((id) =>
          submitData.append('preferred_districts', id.toString())
        );
      }

      if (formData.preferred_upazila) {
        formData.preferred_upazila.forEach((id) =>
          submitData.append('preferred_upazila', id.toString())
        );
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

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-gray-600">
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

        {/* Location Fields */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Location Preferences</h3>
          
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

          {/* Districts Selection */}
          {formData.division && (
            <div className="relative">
              <Label>Preferred Districts</Label>
              <div className="relative mt-1">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-600 min-h-[40px]"
                  onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                >
                  <span className={getSelectedDistrictsNames() ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                    {getSelectedDistrictsNames() || 'Select Districts'}
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
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => handleDistrictToggle(district.id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferred_districts?.includes(district.id) || false}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          {district.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upazilas Selection */}
          {formData.preferred_districts && formData.preferred_districts.length > 0 && (
            <div className="relative">
              <Label>Preferred Upazilas</Label>
              <div className="relative mt-1">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-600 min-h-[40px]"
                  onClick={() => setShowUpazilaDropdown(!showUpazilaDropdown)}
                >
                  <span className={getSelectedUpazilasNames() ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                    {getSelectedUpazilasNames() || 'Select Upazilas'}
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
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => handleUpazilaToggle(upazila.id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferred_upazila?.includes(upazila.id) || false}
                            onChange={() => {}}
                            className="mr-2"
                          />
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