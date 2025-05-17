import { ActiveDay, Area, District, Subject } from "@/types/tutor";
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

import PaginatedMultiSelect from "@/components/MultiSelect";
import MultiSelect from "@/components/MultiSelect";


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
    expected_salary: {
        min_amount: number;
        max_amount: number;
    } | null;
    expected_hourly_charge: {
        min_amount: number;
        max_amount: number;
    } | null;
    subjects: { id: number; subject: string }[];
    active_days: { id: number; day: string }[];
    preferred_districts: { id: number; name: string }[];
    preferred_areas: { id: number; name: string }[];
}

interface PaginatedResponse<T> {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const TuitionForm: React.FC<TuitionFormProps> = ({ formData, updateFormData, onNext, onPrev }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const accessToken = getAccessToken();

    // States for paginated data
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeDays, setActiveDays] = useState<ActiveDay[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    // Pagination states
    const [subjectsPage, setSubjectsPage] = useState<number>(1);
    const [subjectsTotalPages, setSubjectsTotalPages] = useState<number>(1);

    // Selected states for multi-select
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(formData.subjects || []);
    const [selectedActiveDays, setSelectedActiveDays] = useState<string[]>(formData.activeDays || []);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>(formData.preferredDistricts || []);
    const [selectedAreas, setSelectedAreas] = useState<string[]>(formData.preferredAreas || []);

    // Keep track of all subjects for selection (across pagination)
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

    // Fetch subjects with pagination
    const fetchSubjects = async (page = 1) => {
        try {
            const response = await axios.get<PaginatedResponse<Subject>>(
                `${import.meta.env.VITE_API_URL}/api/subjects/?page=${page}`
            );
            setSubjects(response.data.results);
            setSubjectsTotalPages(response.data.total_pages);

            // Add new subjects to our collection of all subjects
            const newSubjects = [...allSubjects];
            response.data.results.forEach(subject => {
                if (!newSubjects.some(s => s.id === subject.id)) {
                    newSubjects.push(subject);
                }
            });
            setAllSubjects(newSubjects);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch subjects", error);
            toast({
                title: "Error",
                description: "Failed to load subjects.",
                variant: "destructive"
            });
            return null;
        }
    };

    // Fetch all subjects (needed for initial load to show selected subjects)
    const fetchAllSubjects = async () => {
        let page = 1;
        let hasNextPage = true;
        const allFetchedSubjects: Subject[] = [];

        while (hasNextPage) {
            const response = await fetchSubjects(page);
            if (!response) break;

            allFetchedSubjects.push(...response.results);

            if (response.next) {
                page++;
            } else {
                hasNextPage = false;
            }
        }

        setAllSubjects(allFetchedSubjects);
    };

    // Fetch active days, districts, and areas
    const fetchLookupData = async () => {
        try {
            const activeDayResponse = await axios.get<PaginatedResponse<ActiveDay>>(`${import.meta.env.VITE_API_URL}/api/active-days/`);
            const districtResponse = await axios.get<PaginatedResponse<District>>(`${import.meta.env.VITE_API_URL}/api/districts/`);
            const areaResponse = await axios.get<PaginatedResponse<Area>>(`${import.meta.env.VITE_API_URL}/api/areas/`);

            setActiveDays(activeDayResponse.data.results);
            setDistricts(districtResponse.data.results);
            setAreas(areaResponse.data.results);
        } catch (error) {
            console.error("Failed to fetch lookup data", error);
            toast({
                title: "Error",
                description: "Failed to load initial data.",
                variant: "destructive"
            });
        }
    };

    // Initial data loading
    useEffect(() => {
        fetchAllSubjects();
        fetchLookupData();
    }, []);

    // Handle subject pagination
    const handleSubjectPageChange = (page: number) => {
        setSubjectsPage(page);
        fetchSubjects(page);
    };

    // Fetch tuition data on component mount
    useEffect(() => {
        const fetchTuitionData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );
                const tuitionData: TuitionInfoResponse = response.data;

                // Update form data
                updateFormData({
                    daysPerWeek: tuitionData.days_per_week ? tuitionData.days_per_week.toString() : '',
                    teachingType: tuitionData.teaching_type_display ? tuitionData.teaching_type_display.toUpperCase() : '',
                    minSalary: tuitionData.expected_salary ? tuitionData.expected_salary.min_amount.toString() : '',
                    maxSalary: tuitionData.expected_salary ? tuitionData.expected_salary.max_amount.toString() : '',
                    minHourlyCharge: tuitionData.expected_hourly_charge ? tuitionData.expected_hourly_charge.min_amount.toString() : '',
                    maxHourlyCharge: tuitionData.expected_hourly_charge ? tuitionData.expected_hourly_charge.max_amount.toString() : '',
                    subjects: tuitionData.subjects.map(s => s.id.toString()),
                    activeDays: tuitionData.active_days.map(d => d.id.toString()),
                    preferredDistricts: tuitionData.preferred_districts.map(d => d.id.toString()),
                    preferredAreas: tuitionData.preferred_areas.map(a => a.id.toString()),
                });

                setSelectedSubjects(tuitionData.subjects.map(s => s.id.toString()));
                setSelectedActiveDays(tuitionData.active_days.map(d => d.id.toString()));
                setSelectedDistricts(tuitionData.preferred_districts.map(d => d.id.toString()));
                setSelectedAreas(tuitionData.preferred_areas.map(a => a.id.toString()));

            } catch (error) {
                console.error('Error fetching tuition data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load tuition data. Please try again.",
                    variant: "destructive",
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
                expected_salary: {
                    min_amount: parseInt(formData.minSalary, 10),
                    max_amount: parseInt(formData.maxSalary, 10),
                },
                expected_hourly_charge: {
                    min_amount: parseInt(formData.minHourlyCharge, 10),
                    max_amount: parseInt(formData.maxHourlyCharge, 10),
                },
                subjects: formData.subjects,
                active_days: formData.activeDays,
                preferred_districts: formData.preferredDistricts,
                preferred_areas: formData.preferredAreas,
            };

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/tutors/c021858d-00ca-4395-907b-1603c6666e88/`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast({
                title: "Success",
                description: "Tuition information updated successfully!",
            });
            onNext();
        } catch (error) {
            console.error('Error updating tuition info:', error);
            toast({
                title: "Error",
                description: "Failed to update tuition information. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle selection changes
    const handleSubjectChange = (selectedIds: string[]) => {
        setSelectedSubjects(selectedIds);
        updateFormData({ subjects: selectedIds });
    };

    const handleActiveDayChange = (selectedIds: string[]) => {
        setSelectedActiveDays(selectedIds);
        updateFormData({ activeDays: selectedIds });
    };

    const handleDistrictChange = (selectedIds: string[]) => {
        setSelectedDistricts(selectedIds);
        updateFormData({ preferredDistricts: selectedIds });
    };

    const handleAreaChange = (selectedIds: string[]) => {
        setSelectedAreas(selectedIds);
        updateFormData({ preferredAreas: selectedIds });
    };

    // Format subject options for multi-select
    const getSubjectOptions = () => {
        return allSubjects.map(subject => ({
            value: subject.id.toString(),
            label: subject.subject
        }));
    };

    // Format day options for multi-select
    const getDayOptions = () => {
        return activeDays.map(day => ({
            value: day.id.toString(),
            label: day.day
        }));
    };

    // Format district options for multi-select
    const getDistrictOptions = () => {
        return districts.map(district => ({
            value: district.id.toString(),
            label: district.name
        }));
    };

    // Format area options for multi-select
    const getAreaOptions = () => {
        return areas.map(area => ({
            value: area.id.toString(),
            label: area.name
        }));
    };

    const [selectedPreferredDistricts, setSelectedPreferredDistricts] = useState<string[]>(formData.preferredDistricts || []);
    const [selectedPreferredAreas, setSelectedPreferredAreas] = useState<string[]>(formData.preferredAreas || []);

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
                    <Label htmlFor="minSalary">Minimum Salary</Label>
                    <Input
                        id="minSalary"
                        type="number"
                        placeholder="Enter minimum salary"
                        value={formData.minSalary}
                        onChange={(e) => updateFormData({ minSalary: e.target.value })}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="maxSalary">Maximum Salary</Label>
                    <Input
                        id="maxSalary"
                        type="number"
                        placeholder="Enter maximum salary"
                        value={formData.maxSalary}
                        onChange={(e) => updateFormData({ maxSalary: e.target.value })}
                        className="mt-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="minHourlyCharge">Minimum Hourly Charge</Label>
                    <Input
                        id="minHourlyCharge"
                        type="number"
                        placeholder="Enter minimum hourly charge"
                        value={formData.minHourlyCharge}
                        onChange={(e) => updateFormData({ minHourlyCharge: e.target.value })}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="maxHourlyCharge">Maximum Hourly Charge</Label>
                    <Input
                        id="maxHourlyCharge"
                        type="number"
                        placeholder="Enter maximum hourly charge"
                        value={formData.maxHourlyCharge}
                        onChange={(e) => updateFormData({ maxHourlyCharge: e.target.value })}
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Subjects with multi-select and pagination */}
            <PaginatedMultiSelect
                label="Subjects"
                options={getSubjectOptions()}
                value={selectedSubjects}
                onChange={handleSubjectChange}
                fetchData={fetchSubjects}
                page={subjectsPage}
                totalPages={subjectsTotalPages}
                onPageChange={handleSubjectPageChange}
            />

            {/* Active Days multi-select */}
            <div>
                <Label htmlFor="activeDays">Active Days</Label>
                <MultiSelect
                    options={getDayOptions()}
                    value={selectedActiveDays}
                    onChange={handleActiveDayChange}
                    placeholder="Select Active Days"
                />
            </div>

            {/* Preferred Districts multi-select */}
            <div>
                <Label htmlFor="preferredDistricts">Preferred Districts</Label>
                <MultiSelect
                    options={getDistrictOptions()}
                    value={selectedPreferredDistricts}
                    onChange={handleDistrictChange}
                    placeholder="Select Preferred Districts"
                />
            </div>

            {/* Preferred Areas multi-select */}
            <div>
                <Label htmlFor="preferredAreas">Preferred Areas</Label>
                <MultiSelect
                    options={getAreaOptions()}
                    value={selectedPreferredAreas}
                    onChange={handleAreaChange}
                    placeholder="Select Preferred Areas"
                />
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" className="px-6" onClick={onPrev} disabled={isLoading}>
                    Previous
                </Button>
                <Button type="button" onClick={handleSubmit} className="px-6" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    );
};

export default TuitionForm;
