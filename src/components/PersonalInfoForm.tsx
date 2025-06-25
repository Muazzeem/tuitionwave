
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, X, Linkedin, Camera, User, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from './ui/textarea';
import { useProfileCompletion } from './ProfileCompletionContext';

interface User {
  preferred_upazila: any;
  preferred_districts: any;
  division: any;
  phone: string;
  email: string;
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  address: string;
}


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

interface ProfileFormData {
  uid?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profile_picture?: string | null;
  gender: string;
  birthDate: Date | null;
  linkedinProfile: string;
  description: string;
  division_id?: number | null;
  preferred_district_id?: number | null;
  preferred_upazila_id?: number | null;
}

interface TutorProfileResponse {
  profile_picture_url: null;
  user: User;
  uid: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profile_picture?: string | null;
  gender_display: string;
  birth_date: string | null;
  linkedin_profile: string | null;
  description: string | null;

}

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, onNext }) => {
  const { refreshProfileCompletion } = useProfileCompletion();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const accessToken = getAccessToken();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const isTeacher = userProfile?.user_type === 'TEACHER';

  // Fetch divisions on component mount for teachers
  useEffect(() => {
    if (isTeacher) {
      fetchDivisions();
    }
  }, [isTeacher]);

  // Fetch districts when division changes
  useEffect(() => {
    if (isTeacher && formData.division_id) {
      fetchDistricts(formData.division_id);
    } else {
      setDistricts([]);
      setUpazilas([]);
      updateFormData({ preferred_district_id: null, preferred_upazila_id: null });
    }
  }, [formData.division_id, isTeacher]);

  // Fetch upazilas when preferred district changes
  useEffect(() => {
    if (isTeacher && formData.preferred_district_id) {
      fetchUpazilas(formData.preferred_district_id);
    } else {
      setUpazilas([]);
      updateFormData({ preferred_upazila_id: null });
    }
  }, [formData.preferred_district_id, isTeacher]);

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

  // Handle search with debouncing
  useEffect(() => {
    if (isTeacher) {
      const timer = setTimeout(() => {
        if (formData.division_id && districtSearch !== '') {
          fetchDistricts(formData.division_id, districtSearch);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [districtSearch, formData.division_id, isTeacher]);

  useEffect(() => {
    if (isTeacher) {
      const timer = setTimeout(() => {
        if (formData.preferred_district_id && upazilaSearch !== '') {
          fetchUpazilas(formData.preferred_district_id, upazilaSearch);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [upazilaSearch, formData.preferred_district_id, isTeacher]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const profileData: TutorProfileResponse = response.data;
        console.log(profileData);
        // Update form data with fetched profile data
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
          preferred_upazila_id: profileData.user.preferred_upazila?.[0]?.id || null
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
  }, [isTeacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
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
    updateFormData({ profile_picture: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDivisionSelect = (division: Division) => {
    updateFormData({
      division_id: division.id,
      preferred_district_id: null,
      preferred_upazila_id: null
    });
    setDivisionSearch(division.name);
    setShowDivisionDropdown(false);
  };

  const handleDistrictSelect = (district: District) => {
    updateFormData({
      preferred_district_id: district.id,
      preferred_upazila_id: null
    });
    setDistrictSearch(district.name);
    setShowDistrictDropdown(false);
  };

  const handleUpazilaSelect = (upazila: Upazila) => {
    updateFormData({ preferred_upazila_id: upazila.id });
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

  const handleSubmit = async () => {
    try {
      if (isTeacher && !formData.phone) {
        toast({
          title: 'Validation Error',
          description: 'Phone number is required.',
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);

      if (isTeacher) {
        // For teachers, update both profile and tutor-specific data
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

        // Profile picture
        if (selectedFile) {
          submitData.append('profile_picture', selectedFile);
        } else if (formData.profile_picture === null) {
          submitData.append('profile_picture', '');
        }

        // Update profile via profile API
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
      } else {
        const payload = {
          gender: formData.gender,
          birth_date: formData.birthDate ? format(formData.birthDate, 'yyyy-MM-dd') : null,
          linkedin_profile: formData.linkedinProfile,
          description: formData.description,
        };

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tutors/${formData.uid}/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      toast({
        title: "Success",
        description: "Personal information updated successfully!",
      });
      onNext();
      await refreshProfileCompletion();
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

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-center text-gray-500">Loading profile data...</div>}
      
      {/* Profile Picture Section - Only for teachers */}
      {isTeacher && (
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
      )}

      {/* Basic Information - Only for teachers */}
      {isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
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
            <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder='+880123456789'
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Standard form fields for all users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value })}
          >
            <SelectTrigger id="gender" className="mt-1">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="birthDate">Birth Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button disabled
                id="birthDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !formData.birthDate && "text-muted-foreground"
                )}
              >
                {formData.birthDate && format(formData.birthDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-md">
              <Calendar 
                mode="single"
                selected={formData.birthDate}
                onSelect={(date) => updateFormData({ birthDate: date })}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <div className="relative mt-1">
          <Input
            id="linkedin"
            placeholder="Enter LinkedIn url"
            value={formData.linkedinProfile}
            onChange={(e) => updateFormData({ linkedinProfile: e.target.value })}
            className="pl-10"
          />
          <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Location Fields - Only for teachers */}
      {isTeacher && (
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
          
          <div>
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
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" className="px-6" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 dark:bg-blue-600 dark:text-white"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
