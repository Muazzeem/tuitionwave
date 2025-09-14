import React, { useState, useEffect, useCallback } from 'react';
import { Tutor, TutorListResponse } from '@/types/tutor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import TutorCard from './TutorCard';

const TutorsList: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTutors = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const base = import.meta.env.VITE_API_URL;
            const apiUrl = `${base}/api/tutors/`;
            const response = await fetch(apiUrl, { signal });
            if (!response.ok) throw new Error(`Failed to fetch tutors: ${response.status}`);
            const data: TutorListResponse = await response.json();
            setTutors((data?.results ?? []).slice(0, 3));
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                console.error(err);
                toast.error('Failed to load tutors');
                setTutors([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchTutors(controller.signal);
        return () => controller.abort();
    }, [fetchTutors]);

    return (
        <div className="w-full mx-auto p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {loading ? (
                    [...Array(3)].map((_, index) => (
                        <Card key={index} className="bg-background border-gray-900 shadow-xl">
                            <div className="p-3">
                                <Skeleton className="h-48 w-full mb-3 bg-slate-800/40 backdrop-blur-md" />
                                <Skeleton className="h-5 w-1/3 mb-2 bg-slate-800/40 backdrop-blur-md" />
                                <Skeleton className="h-8 w-2/3 mb-2 bg-slate-800/40 backdrop-blur-md" />
                                <Skeleton className="h-6 w-full mb-2 bg-slate-800/40 backdrop-blur-md" />
                                <Skeleton className="h-6 w-full mb-4 bg-slate-800/40 backdrop-blur-md" />
                                <Skeleton className="h-10 w-full bg-slate-800/40 backdrop-blur-md" />
                            </div>
                        </Card>
                    ))
                ) : tutors.length > 0 ? (
                    tutors.map((tutor) => (
                        <TutorCard
                            key={tutor.uid}
                            uid={tutor.uid}
                            name={`${tutor?.first_name ?? ''} ${tutor?.last_name ?? ''}`.trim()}
                            teaching_type={tutor.teaching_type}
                            university={tutor.institute ? tutor.institute.name : 'Not specified'}
                            division={tutor?.division?.name || 'Not specified'}
                            upazila={tutor?.upazilas?.[0]?.name || 'Not specified'}
                            district={tutor?.districts?.[0]?.name || 'Not specified'}
                            monthlyRate={tutor.expected_salary ? tutor.expected_salary.display_range : 'Not specified'}
                            rating={tutor.avg_rating}
                            reviewCount={tutor.review_count}
                            image={tutor.profile_picture || '/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png'}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No tutors found. Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorsList;
