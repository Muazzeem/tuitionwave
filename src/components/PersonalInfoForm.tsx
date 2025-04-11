import React, { useState, useRef } from 'react';
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
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
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