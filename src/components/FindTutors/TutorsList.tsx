import React, { useState, useEffect, useCallback } from 'react';
import { Tutor, TutorListResponse } from '@/types/tutor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-10">
                {loading ? (
                    [...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            aria-hidden
                            className={[
                                "relative overflow-hidden rounded-3xl",
                                "bg-slate-800/40 backdrop-blur-md",
                                "border border-white/10",
                                "shadow-lg",
                                "animate-pulse",
                            ].join(" ")}
                        >
                            {/* Image area */}
                            <div className="relative">
                                <Skeleton className="h-48 w-full rounded-none bg-slate-800/50" />

                                {/* Badge placeholder (teaching_type) */}
                                <div className="absolute left-4 top-4">
                                    <Skeleton className="h-6 w-24 rounded-full bg-slate-700/60" />
                                </div>

                                {/* Bottom gradient overlay to match real card */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent" />
                            </div>

                            {/* Body */}
                            <div className="relative -mt-6 px-2 pb-3 xl:pb-5">
                                {/* University row (icon + text) */}
                                <div className="flex items-center mb-1">
                                    <Skeleton className="h-4 w-4 rounded-full mr-2 bg-slate-700/60" />
                                    <Skeleton className="h-3.5 w-2/3 bg-slate-700/60" />
                                </div>

                                {/* Name */}
                                <Skeleton className="h-5 md:h-6 w-3/4 my-2 bg-slate-700/60" />

                                {/* Location row (icon + text) */}
                                <div className="flex items-center mb-2">
                                    <Skeleton className="h-4 w-4 rounded-full mr-2 bg-slate-700/60" />
                                    <Skeleton className="h-3 w-4/5 bg-slate-700/60" />
                                </div>

                                {/* Subjects fallback line */}
                                <Skeleton className="h-3 w-2/3 mb-2 md:mb-5 bg-slate-700/60" />

                                {/* Monthly rate (mobile only) */}
                                <div className="md:hidden mb-3">
                                    <Skeleton className="h-4 w-24 bg-slate-700/60" />
                                </div>

                                {/* Bottom row: rating (left) + chip (right on md+) */}
                                <div className="flex items-center justify-between">
                                    {/* Rating */}
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-5 w-5 rounded-full bg-slate-700/60" />
                                        <Skeleton className="h-4 w-10 bg-slate-700/60" />
                                        <Skeleton className="h-4 w-12 bg-slate-700/60" />
                                    </div>

                                    {/* Monthly rate chip (hidden on mobile to match real) */}
                                    <div className="hidden md:block">
                                        <Skeleton className="h-8 w-28 rounded-full bg-slate-700/60" />
                                    </div>
                                </div>
                            </div>

                            {/* Subtle outer ring */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
                        </div>
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
