// components/TuitionForm.tsx

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
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);

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

    const fetchAreasAndDistricts = async () => {
      try {
        const [areaRes, districtRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/areas`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/districts`),
        ]);

        setAreas(areaRes.data.results);
        setDistricts(districtRes.data.results);
      } catch (error) {
        console.error('Error fetching areas/districts', error);
        toast({
          title: 'Error',
          description: 'Failed to load areas and districts.',
          variant: 'destructive',
        });
      }
    };

    fetchTuitionData();
    fetchAreasAndDistricts();
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

      <SearchableSelect
            label="Preferred District"
            placeholder="Select a district"
            apiEndpoint="/api/districts"
            value={formData.preferredDistricts[0] || ''}
            onValueChange={(val) => updateFormData({ preferredDistricts: [val] })}
            createEntityName="District"
        />

      <SearchableSelect
            label="Preferred Area"
            placeholder="Select an area"
            apiEndpoint="/api/areas"
            value={formData.preferredAreas[0] || ''}
            onValueChange={(val) => updateFormData({ preferredAreas: [val] })}
            createEntityName="Area"
        />

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
