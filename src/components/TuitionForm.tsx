import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

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
}

interface TuitionInfoResponse {
  days_per_week: number;
  teaching_type_display: string;
  expected_salary: {
    min_amount: number;
    max_amount: number;
  } | null;
  expected_hourly_charge: {
    min_amount: number;
    max_amount: number;
  } | null;
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

        // Map the response data to form data with proper null checks
        updateFormData({
          daysPerWeek: tuitionData.days_per_week?.toString() || '',
          teachingType: tuitionData.teaching_type_display?.toUpperCase() || '',
          minSalary: tuitionData.expected_salary?.min_amount?.toString() || '',
          maxSalary: tuitionData.expected_salary?.max_amount?.toString() || '',
          minHourlyCharge: tuitionData.expected_hourly_charge?.min_amount?.toString() || '',
          maxHourlyCharge: tuitionData.expected_hourly_charge?.max_amount?.toString() || '',
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
      
      // Validate required fields
      if (!formData.daysPerWeek || !formData.teachingType) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      const formDataToSend = {
        days_per_week: parseInt(formData.daysPerWeek, 10),
        teaching_type: formData.teachingType,
        expected_salary: formData.minSalary && formData.maxSalary ? {
          min_amount: parseInt(formData.minSalary, 10),
          max_amount: parseInt(formData.maxSalary, 10),
        } : null,
        expected_hourly_charge: formData.minHourlyCharge && formData.maxHourlyCharge ? {
          min_amount: parseInt(formData.minHourlyCharge, 10),
          max_amount: parseInt(formData.maxHourlyCharge, 10),
        } : null,
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minSalary">Min Expected Salary</Label>
          <Input
            id="minSalary"
            type="number"
            placeholder="Min salary"
            value={formData.minSalary}
            onChange={(e) => updateFormData({ minSalary: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="maxSalary">Max Expected Salary</Label>
          <Input
            id="maxSalary"
            type="number"
            placeholder="Max salary"
            value={formData.maxSalary}
            onChange={(e) => updateFormData({ maxSalary: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minHourlyCharge">Min Hourly Charge</Label>
          <Input
            id="minHourlyCharge"
            type="number"
            placeholder="Min hourly charge"
            value={formData.minHourlyCharge}
            onChange={(e) => updateFormData({ minHourlyCharge: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="maxHourlyCharge">Max Hourly Charge</Label>
          <Input
            id="maxHourlyCharge"
            type="number"
            placeholder="Max hourly charge"
            value={formData.maxHourlyCharge}
            onChange={(e) => updateFormData({ maxHourlyCharge: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

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