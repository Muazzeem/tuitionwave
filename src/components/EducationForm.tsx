import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import { X } from 'lucide-react';

interface EducationFormData {
  degree: string;
  institute: string;
  department: string;
  currentStatus: string;
  cvDocument: File | null;
  cv_document_url?: string | null; // Add this line
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
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = getAccessToken();
  const [uid, setUid] = useState<string | null>(null);
  const [availableDegrees, setAvailableDegrees] = useState<{ id: number; name: string }[]>([]);
  const [availableInstitutes, setAvailableInstitutes] = useState<{ id: number; name: string }[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<{ id: number; name: string }[]>([]);

  // Fetch initial data (degrees, institutes, departments)
    useEffect(() => {
        const fetchLookUpData = async () => {
          try {
                const degreeResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/degrees/`);
                const instituteResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/institutes/`);
                // const departmentResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/department/`);

                setAvailableDegrees(degreeResponse.data);
                setAvailableInstitutes(instituteResponse.data);
                // setAvailableDepartments(departmentResponse.data);

          } catch (error) {
            console.error("Failed to fetch lookup data", error);
            toast({
                title: "Error",
                description: "Failed to load initial data.",
                variant: "destructive"
            })
          }
        }
        fetchLookUpData();
    }, []);

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
        
        // Update form data with fetched education data.  Handle nulls.
        updateFormData({
            degree: educationData.degree ? educationData.degree.id.toString() : '',
            institute: educationData.institute ? educationData.institute.id.toString() : '',
            department: educationData.department ? educationData.department.id.toString() : '',
            currentStatus: educationData.current_status_display ? educationData.current_status_display.toUpperCase() : '',
            cvDocument: null, // We don't want to set a File object from a URL.
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
        `${import.meta.env.VITE_API_URL}/api/tutors/${uid}/`, // Use the uid
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
        <Label className="text-gray-600 font-medium mb-2 block">Upload CV</Label>
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
            <span className="text-gray-500">Select a file to upload</span>
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
        <Label htmlFor="degree">Degree</Label>
        <Select
          value={formData.degree}
          onValueChange={(value) => updateFormData({ degree: value })}
          >
            <SelectTrigger id="degree" className="mt-1">
              <SelectValue placeholder="Select Degree" />
            </SelectTrigger>
            <SelectContent>
            {availableDegrees.map((degree) => (
                <SelectItem key={degree.id} value={degree.id.toString()}>
                {degree.name}
                </SelectItem>
            ))}
            </SelectContent>
          </Select>
      </div>

      <div>
        <Label htmlFor="institute">Institute</Label>
        <Select
          value={formData.institute}
          onValueChange={(value) => updateFormData({ institute: value })}
        >
          <SelectTrigger id="institute" className="mt-1">
            <SelectValue placeholder="Select Institute" />
          </SelectTrigger>
          <SelectContent>
          {availableInstitutes.map((institute) => (
                <SelectItem key={institute.id} value={institute.id.toString()}>
                {institute.name}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => updateFormData({ department: value })}
        >
          <SelectTrigger id="department" className="mt-1">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
          {availableDepartments.map((department) => (
                <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            {/* <SelectItem value="ON_BREAK">On Break</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" className="px-6" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button type="button" onClick={handleSubmit} className="px-6"  disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};

export default EducationForm;
