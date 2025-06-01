
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import SearchableSelect from './SearchableSelect';
import SearchableMultiSelect from './SearchableMultiSelect';
import LocationSelector from './LocationSelector';

interface TuitionFormProps {
  formData: TuitionFormData;
  updateFormData: (data: Partial<TuitionFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface TuitionFormData {
  daysPerWeek: string;
  teachingType: string;
  minSalary: string;
  maxSalary: string;
  minHourlyCharge: string;
  maxHourlyCharge: string;
  subjects: string[];
  activeDays: string[];
  preferredDistricts: string[];
  preferredAreas: string[];
  selectedDivision?: string;
  selectedDistrict?: string;
  selectedUpazila?: string;
  selectedArea?: string;
}

interface TuitionInfoResponse {
  days_per_week: number;
  teaching_type_display: string;
  preferred_districts: { id: number; name: string }[];
  preferred_areas: { id: number; name: string }[];
}

const TuitionForm: React.FC<TuitionFormProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accessToken = getAccessToken();

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchTuitionData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const tuitionData: TuitionInfoResponse = response.data;
        setUid(response.data.uid);

        updateFormData({
          daysPerWeek: tuitionData.days_per_week?.toString() || '',
          teachingType: tuitionData.teaching_type_display?.toUpperCase() || '',
          preferredAreas: tuitionData.preferred_areas.map((a) => a.id.toString()),
          preferredDistricts: tuitionData.preferred_districts.map((d) => d.id.toString()),
        });
      } catch (error) {
        console.error('Error fetching tuition data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tuition data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTuitionData();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formDataToSend = {
        days_per_week: parseInt(formData.daysPerWeek, 10),
        teaching_type: formData.teachingType,
        preferred_areas: formData.preferredAreas.map(Number),
        preferred_districts: formData.preferredDistricts.map(Number),
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/tutors/${uid}/`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      toast({
        title: 'Success',
        description: 'Tuition information updated successfully!',
      });
    } catch (error) {
      console.error('Error updating tuition info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tuition information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-center text-gray-500">Loading tuition data...</div>}

      <div>
        <Label htmlFor="daysPerWeek">Days per Week</Label>
        <Input
          id="daysPerWeek"
          type="number"
          placeholder="Enter days per week"
          value={formData.daysPerWeek}
          onChange={(e) => updateFormData({ daysPerWeek: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="teachingType">Teaching Type</Label>
        <Select
          value={formData.teachingType}
          onValueChange={(value) => updateFormData({ teachingType: value })}
        >
          <SelectTrigger id="teachingType" className="mt-1">
            <SelectValue placeholder="Select Teaching Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="BOTH">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium mb-4 block">Location Preferences</Label>
        <LocationSelector
          selectedDivision={formData.selectedDivision}
          selectedDistrict={formData.selectedDistrict}
          selectedUpazila={formData.selectedUpazila}
          selectedArea={formData.selectedArea}
          onDivisionChange={(value) => updateFormData({ selectedDivision: value })}
          onDistrictChange={(value) => updateFormData({ selectedDistrict: value })}
          onUpazilaChange={(value) => updateFormData({ selectedUpazila: value })}
          onAreaChange={(value) => updateFormData({ selectedArea: value })}
        />
      </div>

      <SearchableMultiSelect
        label="Active Days"
        placeholder="Select active days"
        apiEndpoint="/api/active-days/"
        selectedValues={formData.activeDays || []}
        onChange={(vals) => updateFormData({ activeDays: vals })}
        labelKey="day"
      />

      <div className="flex justify-between pt-4">
        <Button variant="outline" className="px-6" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 dark:bg-blue-600 dark:text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default TuitionForm;
