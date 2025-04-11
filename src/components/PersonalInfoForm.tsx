
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, X, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfileFormData } from '@/types/tutor';

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData, onNext }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
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
    updateFormData({ profilePicture: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Upload Profile Picture</h3>
        <div className="flex items-center space-x-4">
          {previewImage ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border">
                <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-red-500"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No image</span>
            </div>
          )}
          
          <div>
            <Label
              htmlFor="profile-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Upload
            </Label>
            <Input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">profilepicture.jpg</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          placeholder="Enter Full Name" 
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
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
          <Select 
            value={formData.gender} 
            onValueChange={(value) => updateFormData({ gender: value })}
          >
            <SelectTrigger id="gender" className="mt-1">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="birthDate">Birth Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
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
        <Button variant="outline" className="px-6">
          Cancel
        </Button>
        <Button type="button" onClick={onNext} className="px-6">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
