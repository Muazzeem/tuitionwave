import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, X, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormData {
  uid?: string;
  profilePicture: File | null;
  profile_picture_url?: string | null;
  full_name: string;
  address: string;
  gender: string;
  birthDate: Date | null;
  linkedinProfile: string;
}

interface TutorProfileResponse {
  full_name: string;
  uid: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  address: string;
  gender_display: string;
  birth_date: string | null;
  // Other fields from the API response that we're not using in this form
}

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, onNext }) => {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = getAccessToken();

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
        
        // Update form data with fetched profile data
        updateFormData({
          uid: profileData.uid,
          address: profileData.address || '',
          gender: profileData.gender_display ? profileData.gender_display.toUpperCase() : '',
          birthDate: profileData.birth_date ? parseISO(profileData.birth_date) : null,
          profilePicture: null,
          full_name: profileData.full_name
        });
        
        // Set profile picture preview if available
        if (profileData.profile_picture_url) {
          setPreviewImage(profileData.profile_picture_url);
          setFileName('Current Profile Picture');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      updateFormData({ profilePicture: file });
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFileName('');
    updateFormData({ profilePicture: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Create form data for multipart/form-data request
      const formDataToSend = new FormData();
      if (formData.profilePicture) {
        formDataToSend.append('profile_picture', formData.profilePicture);
      }
      formDataToSend.append('address', formData.address);
      formDataToSend.append('gender', formData.gender);
      if (formData.birthDate) {
        formDataToSend.append('birth_date', format(formData.birthDate, 'yyyy-MM-dd'));
      }
      
      // Add other fields as needed
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tutors/${formData.uid}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast({
        title: "Success",
        description: "Personal information updated successfully!",
      });
      onNext();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-center text-gray-500">Loading profile data...</div>}
      
      <div>
        <Label className="text-gray-600 font-medium mb-2 block">Upload Profile Picture</Label>
        <div
          className="border border-gray-300 rounded-lg p-3 flex items-center cursor-pointer"
          onClick={handleUploadClick}
        >
          {previewImage ? (
            <>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 mr-3">
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-blue-500 flex-grow">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-gray-500">Select a file to upload</span>
          )}
          <Input
            ref={fileInputRef}
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input disabled
          id="fullName"
          placeholder="Enter Full Name"
          value={formData.full_name}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <div className="relative mt-1">
          <Input
            id="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
          />
          {formData.address && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={() => updateFormData({ address: '' })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select disabled
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
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthDate ? format(formData.birthDate, "PPP") : <span>Select Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.birthDate}
                onSelect={(date) => updateFormData({ birthDate: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
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

      <div className="flex justify-between pt-4">
        <Button variant="outline" className="px-6" disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="px-6"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;