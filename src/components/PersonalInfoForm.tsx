import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { Linkedin, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

import { Tutor } from '@/types/tutor';
import { ProfileFormData, Division, District, Upazila } from '@/types/common';
import { ProfileCompletionAlertRef } from './ProfileCompletionAlert';
import { ProfilePictureSection } from './ProfilePicture/ProfilePictureSection';

export interface Area {
  id: number;
  name: string;
}

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, onNext }) => {
  const profileRef = useRef<ProfileCompletionAlertRef>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const accessToken = getAccessToken();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Location data states
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

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

  // Fetch data functions
  const fetchDivisions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/divisions/`);
      const data = await response.json();
      setDivisions(data.results || []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
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
    }
  };

  const fetchAreas = async (upazilaId: number, search = '') => {
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/areas/?upazila=${upazilaId}${searchParam}`);
      const data = await response.json();
      setAreas(data.results || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  // Effects
  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (formData.division_id) {
      fetchDistricts(formData.division_id);
    } else {
      setDistricts([]);
      setUpazilas([]);
      setAreas([]);
      updateFormData({
        preferred_district_id: null,
        preferred_upazila_id: null,
        preferred_area_id: null
      });
    }
  }, [formData.division_id]);

  useEffect(() => {
    if (formData.preferred_district_id) {
      fetchUpazilas(formData.preferred_district_id);
    } else {
      setUpazilas([]);
      setAreas([]);
      updateFormData({
        preferred_upazila_id: null,
        preferred_area_id: null
      });
    }
  }, [formData.preferred_district_id]);

  useEffect(() => {
    if (formData.preferred_upazila_id) {
      fetchAreas(formData.preferred_upazila_id);
    } else {
      setAreas([]);
      updateFormData({ preferred_area_id: null });
    }
  }, [formData.preferred_upazila_id]);

  // Search debouncing effects
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
    const timer = setTimeout(() => {
      if (formData.preferred_upazila_id && areaSearch !== '') {
        fetchAreas(formData.preferred_upazila_id, areaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [areaSearch, formData.preferred_upazila_id]);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const profileData: Tutor = response.data;
        updateFormData({
          uid: profileData.uid,
          first_name: profileData.user.first_name || '',
          last_name: profileData.user.last_name || '',
          email: profileData.user.email || '',
          phone: profileData.user.phone || '',
          address: profileData.user.address || '',
          profile_picture: profileData.profile_picture_url || null,
          gender: profileData.gender_display ? profileData.gender_display.toUpperCase() : '',
          birthDate: profileData.birth_date ? parseISO(profileData.birth_date) : null,
          linkedinProfile: profileData.linkedin_profile || '',
          description: profileData.description || '',
          division_id: profileData.user.division?.id || null,
          preferred_district_id: profileData.user.preferred_districts?.[0]?.id || null,
          preferred_upazila_id: profileData.user.preferred_upazila?.[0]?.id || null,
          preferred_area_id: profileData.user.preferred_area?.[0]?.id || null,
        });

        if (profileData.profile_picture_url && typeof profileData.profile_picture_url === 'string') {
          setPreviewUrl(profileData.profile_picture_url);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleFileSelect = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    updateFormData({ profile_picture: null });
  };

  const handleDivisionSelect = (division: Division) => {
    updateFormData({
      division_id: division.id,
      preferred_district_id: null,
      preferred_upazila_id: null,
      preferred_area_id: null,
    });
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
  };

  const handleDistrictSelect = (district: District) => {
    updateFormData({
      preferred_district_id: district.id,
      preferred_upazila_id: null,
      preferred_area_id: null,
    });
    setDistrictSearch(district.name);
    setShowDistrictDropdown(false);
  };

  const handleUpazilaSelect = (upazila: Upazila) => {
    updateFormData({
      preferred_upazila_id: upazila.id,
      preferred_area_id: null
    });
    setUpazilaSearch(upazila.name);
    setShowUpazilaDropdown(false);
  };

  const handleAreaSelect = (area: Area) => {
    updateFormData({ preferred_area_id: area.id });
    setAreaSearch(area.name);
    setShowAreaDropdown(false);
  };

  // Utility functions
  const getSelectedName = (id: number | null, items: any[], searchValue: string) => {
    const selected = items.find(item => item.id === id);
    return selected ? selected.name : searchValue;
  };

  const filterItems = (items: any[], searchValue: string) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleSubmit = async () => {
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

      // Basic info
      submitData.append('first_name', formData.first_name || '');
      submitData.append('last_name', formData.last_name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');

      // Location fields
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

      // Profile picture
      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      } else if (formData.profile_picture === null) {
        submitData.append('profile_picture', '');
      }

      // Update profile
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile/`, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update tutor-specific fields
      const tutorPayload = {
        gender: formData.gender,
        birth_date: formData.birthDate ? format(formData.birthDate, 'yyyy-MM-dd') : null,
        linkedin_profile: formData.linkedinProfile,
        description: formData.description,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tutors/${formData.uid}/`,
        tutorPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: "Success",
        description: "Personal information updated successfully!",
      });

      onNext();
      profileRef.current?.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Custom Dropdown Component
  const CustomDropdown = ({
    label,
    items,
    selectedId,
    searchValue,
    onSearchChange,
    onSelect,
    showDropdown,
    setShowDropdown,
    placeholder
  }: any) => (
    <div className="relative">
      <Label className="text-white">{label}</Label>
      <div className="relative mt-1">
        <div
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md cursor-pointer flex items-center justify-between text-white hover:border-slate-500 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className={getSelectedName(selectedId, items, searchValue) ? 'text-white' : 'text-gray-400'}>
            {getSelectedName(selectedId, items, searchValue) || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-xl">
            <div className="p-2 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white focus:border-slate-500"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filterItems(items, searchValue).map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                  onClick={() => onSelect(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading profile data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <ProfilePictureSection
          previewUrl={previewUrl}
          onFileSelect={handleFileSelect}
          onRemoveImage={handleRemoveImage}
        />
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="text-white">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="last_name" className="text-white">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-700 border-slate-600 opacity-60 cursor-not-allowed"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white">Phone <span className="text-red-400">*</span></Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+880123456789"
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="gender" className="text-white">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value })}
          >
            <SelectTrigger id="gender" className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="MALE" className="text-white hover:bg-slate-700">Male</SelectItem>
              <SelectItem value="FEMALE" className="text-white hover:bg-slate-700">Female</SelectItem>
              <SelectItem value="OTHER" className="text-white hover:bg-slate-700">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1 text-white bg-slate-800/50 border-slate-600 hover:bg-slate-700",
                  !formData.birthDate && "text-gray-400"
                )}
              >
                {formData.birthDate ? format(formData.birthDate, "PPP") : "Select birth date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600 shadow-xl">
              <Calendar
                mode="single"
                selected={formData.birthDate}
                onSelect={(date) => updateFormData({ birthDate: date })}
                className="rounded-md bg-slate-800 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* LinkedIn */}
      <div>
        <Label htmlFor="linkedin" className="text-white">LinkedIn Profile</Label>
        <div className="relative mt-1">
          <Input
            id="linkedin"
            placeholder="Enter LinkedIn url"
            value={formData.linkedinProfile}
            onChange={(e) => updateFormData({ linkedinProfile: e.target.value })}
            className="pl-10 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
          <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Division */}
          <CustomDropdown
            label="Division"
            items={divisions}
            selectedId={formData.division_id}
            searchValue={divisionSearch}
            onSearchChange={setDivisionSearch}
            onSelect={handleDivisionSelect}
            showDropdown={showDivisionDropdown}
            setShowDropdown={setShowDivisionDropdown}
            placeholder="Select Division"
          />

          {/* District */}
          {formData.division_id && (
            <CustomDropdown
              label="District"
              items={districts}
              selectedId={formData.preferred_district_id}
              searchValue={districtSearch}
              onSearchChange={setDistrictSearch}
              onSelect={handleDistrictSelect}
              showDropdown={showDistrictDropdown}
              setShowDropdown={setShowDistrictDropdown}
              placeholder="Select District"
            />
          )}

          {/* Upazila */}
          {formData.preferred_district_id && (
            <CustomDropdown
              label="Upazila"
              items={upazilas}
              selectedId={formData.preferred_upazila_id}
              searchValue={upazilaSearch}
              onSearchChange={setUpazilaSearch}
              onSelect={handleUpazilaSelect}
              showDropdown={showUpazilaDropdown}
              setShowDropdown={setShowUpazilaDropdown}
              placeholder="Select Upazila"
            />
          )}

          {/* Area */}
          {formData.preferred_upazila_id && (
            <CustomDropdown
              label="Area"
              items={areas}
              selectedId={formData.preferred_area_id}
              searchValue={areaSearch}
              onSearchChange={setAreaSearch}
              onSelect={handleAreaSelect}
              showDropdown={showAreaDropdown}
              setShowDropdown={setShowAreaDropdown}
              placeholder="Select Area"
            />
          )}
        </div>

        {/* Address */}
        <div>
          <Label className="text-white" htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          className="px-6 text-white bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500"
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 bg-cyan-400 text-black hover:bg-cyan-500 font-semibold"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;