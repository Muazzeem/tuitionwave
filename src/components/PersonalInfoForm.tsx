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
  gender: string;
  birthDate: Date | null;
  linkedinProfile: string;
}

interface TutorProfileResponse {
  uid: string;
  gender_display: string;
  birth_date: string | null;
  linkedin_profile: string | null;
  // Other fields from the API response that we're not using in this form
}

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, onNext }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          gender: profileData.gender_display ? profileData.gender_display.toUpperCase() : '',
          birthDate: profileData.birth_date ? parseISO(profileData.birth_date) : null,
          linkedinProfile: profileData.linkedin_profile || '',
        });

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const payload = {
        gender: formData.gender,
        birth_date: formData.birthDate ? format(formData.birthDate, 'yyyy-MM-dd') : null,
        linkedin_profile: formData.linkedinProfile,
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

      <div className="grid grid-cols-2 gap-4">
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
          className="px-6 dark:bg-blue-600 dark:text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;