import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';
import { Textarea } from './ui/textarea';
import { Plus, Router } from 'lucide-react';
import { useProfileCompletion } from './ProfileCompletionContext';
import { useNavigate } from 'react-router-dom';

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
  activeDaysIds?: number[];
  preferredTime: string;
  subjects?: number[]; // Array of subject IDs
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
  active_days: ActiveDay[];
  preferred_time: string;
  subjects?: Subject[]; // Array of subject objects from API
}

interface ActiveDay {
  id: number;
  day: string;
}

interface Subject {
  id: number;
  subject: string;
}

interface ActiveDaysResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ActiveDay[];
}

interface SubjectsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: Subject[];
}

const TuitionForm: React.FC<TuitionFormProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { refreshProfileCompletion } = useProfileCompletion();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDays, setActiveDays] = useState<ActiveDay[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isCreatingSubject, setIsCreatingSubject] = useState<boolean>(false);
  const accessToken = getAccessToken();

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch active days
        const activeDaysResponse = await axios.get<ActiveDaysResponse>(
          `${import.meta.env.VITE_API_URL}/api/active-days/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        setActiveDays(activeDaysResponse.data.results);

        // Fetch initial subjects
        await searchSubjects('');

        // Fetch tuition data
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const tuitionData: TuitionInfoResponse = response.data;
        setUid(response.data.uid);

        // Map the response data to form data with proper null checks
        const selectedDayIds = tuitionData.active_days ? tuitionData.active_days.map(day => day.id) : [];
        const selectedSubjectIds = tuitionData.subjects ? tuitionData.subjects.map(subject => subject.id) : [];
        
        updateFormData({
          daysPerWeek: tuitionData.days_per_week?.toString() || '',
          teachingType: tuitionData.teaching_type_display?.toUpperCase() || '',
          minSalary: tuitionData.expected_salary?.min_amount?.toString() || '',
          maxSalary: tuitionData.expected_salary?.max_amount?.toString() || '',
          minHourlyCharge: tuitionData.expected_hourly_charge?.min_amount?.toString() || '',
          maxHourlyCharge: tuitionData.expected_hourly_charge?.max_amount?.toString() || '',
          activeDaysIds: selectedDayIds,
          preferredTime: tuitionData.preferred_time || '',
          subjects: selectedSubjectIds,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchSubjects = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      const response = await axios.get<SubjectsResponse>(
        `${import.meta.env.VITE_API_URL}/api/subjects?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setSubjects(response.data.results);
    } catch (error) {
      console.error('Error searching subjects:', error);
      toast({
        title: 'Error',
        description: 'Failed to search subjects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const createSubject = async (subjectName: string) => {
    try {
      setIsCreatingSubject(true);
      const response = await axios.post<Subject>(
        `${import.meta.env.VITE_API_URL}/api/subjects/`,
        { subject: subjectName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newSubject = response.data;
      setSubjects(prev => [newSubject, ...prev]);
      
      // Automatically select the newly created subject
      handleSubjectSelection(newSubject.id);
      
      toast({
        title: 'Success',
        description: `Subject "${subjectName}" created and selected.`,
      });
      
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to create subject. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchSubjects(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleDaySelection = (dayId: number) => {
    const currentSelectedDays = formData.activeDaysIds || [];
    let updatedDays: number[];

    if (currentSelectedDays.includes(dayId)) {
      updatedDays = currentSelectedDays.filter(id => id !== dayId);
    } else {
      updatedDays = [...currentSelectedDays, dayId];
    }

    updateFormData({ activeDaysIds: updatedDays });
  };

  const handleSubjectSelection = (subjectId: number) => {
    const currentSelectedSubjects = formData.subjects || [];
    let updatedSubjects: number[];

    if (currentSelectedSubjects.includes(subjectId)) {
      updatedSubjects = currentSelectedSubjects.filter(id => id !== subjectId);
    } else {
      updatedSubjects = [...currentSelectedSubjects, subjectId];
    }

    updateFormData({ subjects: updatedSubjects });
  };

  const handleCreateSubject = () => {
    if (searchTerm.trim()) {
      createSubject(searchTerm.trim());
    }
  };

  const isSubjectInResults = subjects.some(subject => 
    subject.subject.toLowerCase() === searchTerm.toLowerCase()
  );

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
        active_days: formData.activeDaysIds || [],
        subjects: formData.subjects || [], // Send array of subject IDs
        expected_salary: formData.minSalary && formData.maxSalary ? {
          min_amount: parseInt(formData.minSalary, 10),
          max_amount: parseInt(formData.maxSalary, 10),
        } : null,
        expected_hourly_charge: formData.minHourlyCharge && formData.maxHourlyCharge ? {
          min_amount: parseInt(formData.minHourlyCharge, 10),
          max_amount: parseInt(formData.maxHourlyCharge, 10),
        } : null,
        preferred_time: formData.preferredTime,
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
      await refreshProfileCompletion();
      navigate(`/profile/tutor`);
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
      {isLoading && <div className="text-center text-gray-500">Loading data...</div>}

      <div>
        <Label htmlFor="daysPerWeek">Days per Week</Label>
        {formData.activeDaysIds && formData.activeDaysIds.length > 0 && (
          <Input disabled
            id="daysPerWeek"
            placeholder="Enter days per week"
            value={formData.activeDaysIds.length} 
            onChange={(e) => updateFormData({ daysPerWeek: e.target.value })}
            className="mt-1"
          />
        )}
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

      {/* Active Days Selection */}
      <div>
        <Label>Active Days</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {activeDays.map((day) => {
            const isSelected = formData.activeDaysIds?.includes(day.id) || false;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => handleDaySelection(day.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                disabled={isLoading}
              >
                {day.day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Selection */}
      <div>
        <Label>Subjects</Label>
        
        {/* Search Box */}
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search or create subjects..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1"
            />
          </div>

          {searchTerm && !isSubjectInResults && (
              <Button
                type="button"
                onClick={handleCreateSubject}
                disabled={isCreatingSubject || !searchTerm.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus /> {isCreatingSubject ? 'Creating...' : 'Create'}
              </Button>
            )}
          
          {isSearching && (
            <div className="text-sm text-gray-500">Searching...</div>
          )}
        </div>

        {/* Available Subjects */}
        <div className="flex flex-wrap gap-2 mt-3">
          {subjects.map((subject) => {
            const isSelected = formData.subjects?.includes(subject.id) || false;
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => handleSubjectSelection(subject.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                disabled={isLoading}
              >
                {subject.subject}
              </button>
            );
          })}
        </div>        
      </div>

      {/* Preferred Time */}
      <div>
        <Label>Preferred Time</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          <Textarea
            id="preferredTime"  
            placeholder='Sunday 10:00 AM to 12:00 PM'
            value={formData.preferredTime}
            onChange={(e) => updateFormData({ preferredTime: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
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