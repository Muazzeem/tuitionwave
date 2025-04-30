import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

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

interface AreaResponse {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    results: { id: number; name: string }[];
}

interface TuitionFormProps {
    formData: TuitionFormData;
    updateFormData: (data: Partial<TuitionFormData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

const TuitionForm: React.FC<TuitionFormProps> = ({ formData, updateFormData, onNext, onPrev }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const accessToken = getAccessToken();
    const [availableSubjects, setAvailableSubjects] = useState<{ id: number; subject: string }[]>([]);
    const [availableActiveDays, setAvailableActiveDays] = useState<{ id: number; day: string }[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<{ id: number; name: string }[]>([]);
    const [availableAreas, setAvailableAreas] = useState<{ id: number; id: number; name: string }[]>([]); // Added id to the type
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedActiveDays, setSelectedActiveDays] = useState<string[]>([]);
    const [selectedPreferredDistricts, setSelectedPreferredDistricts] = useState<string[]>([]);
    const [selectedPreferredAreas, setSelectedPreferredAreas] = useState<string[]>([]);


    // Fetch initial data
    useEffect(() => {
        const fetchLookUpData = async () => {
            try {
                const subjectResponse = await axios.get('http://127.0.0.1:8000/api/subjects/');
                // const activeDayResponse = await axios.get('http://127.0.0.1:8000/api/active-days/');
                // const districtResponse = await axios.get('http://127.0.0.1:8000/api/districts/');
                const areaResponse = await axios.get<AreaResponse>('http://127.0.0.1:8000/api/areas/');

                setAvailableSubjects(subjectResponse.data.results);
                // setAvailableActiveDays(activeDayResponse.data.results);
                // setAvailableDistricts(districtResponse.data.results);
                // Fixed: Handle the paginated response structure for areas
                setAvailableAreas(areaResponse.data.results);

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

    // Fetch tuition data on component mount
    useEffect(() => {
        const fetchTuitionData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/api/tutors/my-profile`,
                    {
                        method: "GET",
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
                setSelectedPreferredDistricts(tuitionData.preferred_districts.map(d => d.id.toString()));
                setSelectedPreferredAreas(tuitionData.preferred_areas.map(a => a.id.toString()));

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
                `http://127.0.0.1:8000/api/tutors/c021858d-00ca-4395-907b-1603c6666e88/`, // Fixed: Removed double slash
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
    const handleSubjectChange = (value: string[]) => {
        setSelectedSubjects(value);
        updateFormData({ subjects: value });
    };

    const handleActiveDayChange = (value: string[]) => {
        setSelectedActiveDays(value);
        updateFormData({ activeDays: value });
    };

    const handleDistrictChange = (value: string[]) => {
        setSelectedPreferredDistricts(value);
        updateFormData({ preferredDistricts: value });
    };

    const handleAreaChange = (value: string[]) => {
        setSelectedPreferredAreas(value);
        updateFormData({ preferredAreas: value });
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
            <div>
                <Label htmlFor="subjects">Subjects</Label>
                <Select
                    multiple
                    value={formData.subjects}
                    onValueChange={handleSubjectChange}
                >
                    <SelectTrigger id="subjects" className="mt-1">
                        <SelectValue placeholder="Select Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                {subject.subject}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="activeDays">Active Days</Label>
                <Select
                    multiple
                    value={formData.activeDays}
                    onValueChange={handleActiveDayChange}
                >
                    <SelectTrigger id="activeDays" className="mt-1">
                        <SelectValue placeholder="Select Active Days" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableActiveDays.map((day) => (
                            <SelectItem key={day.id} value={day.id.toString()}>
                                {day.day}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="preferredDistricts">Preferred Districts</Label>
                <Select
                    multiple
                    value={formData.preferredDistricts}
                    onValueChange={handleDistrictChange}
                >
                    <SelectTrigger id="preferredDistricts" className="mt-1">
                        <SelectValue placeholder="Select Preferred Districts" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDistricts.map((district) => (
                            <SelectItem key={district.id} value={district.id.toString()}>
                                {district.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="preferredAreas">Preferred Areas</Label>
                <Select
                    multiple
                    value={formData.preferredAreas}
                    onValueChange={handleAreaChange}
                >
                    <SelectTrigger id="preferredAreas" className="mt-1">
                        <SelectValue placeholder="Select Preferred Areas" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableAreas.map((area) => (
                            <SelectItem key={area.id} value={area.id.toString()}>
                                {area.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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

