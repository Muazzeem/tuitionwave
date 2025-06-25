
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import { X } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { useProfileCompletion } from './ProfileCompletionContext';

interface EducationFormData {
  degree: string;
  institute: string;
  department: string;
  currentStatus: string;
  cvDocument: File | null;
  cv_document_url?: string | null;
}

interface EducationInfoResponse {
    degree: { id: number; name: string } | null;
    institute: { id: number; name: string } | null;
    department: { id: number; name: string } | null;
    current_status_display: string;
    cv_document: string | null;
}

interface EducationFormProps {
  formData: EducationFormData;
  updateFormData: (data: Partial<EducationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { refreshProfileCompletion } = useProfileCompletion();
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = getAccessToken();
  const [uid, setUid] = useState<string | null>(null);

  // Fetch education data on component mount
  useEffect(() => {
    const fetchEducationData = async () => {
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
        setUid(response.data.uid);
        const educationData: EducationInfoResponse = response.data;
        
        updateFormData({
          degree: educationData.degree ? educationData.degree.id.toString() : '',
          institute: educationData.institute ? educationData.institute.id.toString() : '',
          department: educationData.department ? educationData.department.id.toString() : '',
          currentStatus: educationData.current_status_display ? educationData.current_status_display.toUpperCase() : '',
          cvDocument: null,
          cv_document_url: educationData.cv_document || null,
        });

        if(educationData.cv_document){
          setFileName('Current CV Document');
        }
        
      } catch (error) {
        console.error('Error fetching education data:', error);
        toast({
          title: "Error",
          description: "Failed to load education data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      updateFormData({ cvDocument: file });
    }
  };

  const removeCV = () => {
    setFileName('');
    updateFormData({ cvDocument: null });
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

      const formDataToSend = new FormData();
      formDataToSend.append('degree', formData.degree);
      formDataToSend.append('institute', formData.institute);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('current_status', formData.currentStatus);

      if (formData.cvDocument) {
        formDataToSend.append('cv_document', formData.cvDocument);
      }
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tutors/${uid}/`,
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
        description: "Education information updated successfully!",
      });
      await refreshProfileCompletion();
      onNext();
    } catch (error) {
      console.error('Error updating education info:', error);
      toast({
        title: "Error",
        description: "Failed to update education information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-center text-gray-500">Loading education data...</div>}

      <div>
        <Label className="text-gray-600 font-medium mb-2 block dark:text-white">Upload CV</Label>
        <div
          className="border border-gray-300 rounded-lg p-3 flex items-center cursor-pointer"
          onClick={handleUploadClick}
        >
          {fileName ? (
            <>
              <span className="text-blue-500 flex-grow">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCV();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-gray-500 dark:text-white">Select a file to upload</span>
          )}
          <Input
            ref={fileInputRef}
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <SearchableSelect
          label="Degree"
          value={formData.degree}
          onValueChange={(value) => updateFormData({ degree: value })}
          apiEndpoint="/api/degrees/"
          placeholder="Select Degree"
          createEntityName="Degree"
        />
      </div>

      <div>
        <SearchableSelect
          label="Institute"
          value={formData.institute}
          onValueChange={(value) => updateFormData({ institute: value })}
          apiEndpoint="/api/institutes/"
          placeholder="Select Institute"
          createEntityName="Institute"
        />
      </div>

      <div>
        <SearchableSelect
          label="Department"
          value={formData.department}
          onValueChange={(value) => updateFormData({ department: value })}
          apiEndpoint="/api/departments/"
          placeholder="Select Department"
          createEntityName="Department"
        />
      </div>

      <div>
        <Label htmlFor="currentStatus">Current Status</Label>
        <Select
          value={formData.currentStatus}
          onValueChange={(value) => updateFormData({ currentStatus: value })}
        >
          <SelectTrigger id="currentStatus" className="mt-1">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RUNNING">Running</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" className="px-6" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button type="button" onClick={handleSubmit} className="px-6 px-6 dark:bg-blue-600 dark:text-white" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default EducationForm;
