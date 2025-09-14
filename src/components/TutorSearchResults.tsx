import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tutor, TutorListResponse } from '@/types/tutor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Card } from './ui/card';
import TutorCard from './FindTutors/TutorCard';
import SearchSection from './SearchSection';

type Filters = {
  institution: string;
  subject: string;
  gender: string;
  division: string;
  upazila: string;
  districts: string;
  areas: string;
};

const TutorSearchResults: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters: Filters = useMemo(() => {
    const institution = searchParams.get('institution') || searchParams.get('institute') || '';
    const subject = searchParams.get('subject') || searchParams.get('subjects') || '';
    const upazila = searchParams.get('upazila') || '';
    const gender = searchParams.get('gender') || '';
    const division = searchParams.get('division') || '';
    const districts = searchParams.get('districts') || '';
    const areas = searchParams.get('areas') || '';
    return { institution, subject, gender, division, upazila, districts, areas };
  }, [searchParams]);

  const [searchFilters, setSearchFilters] = useState<Filters>(urlFilters);

  useEffect(() => {
    setSearchFilters(urlFilters);
  }, [urlFilters]);

  const buildApiUrl = useCallback((filters: Filters) => {
    const params = new URLSearchParams();

    if (filters.institution) params.append('institute', filters.institution);
    if (filters.subject) params.append('subjects', filters.subject);
    if (filters.gender) params.append('gender', filters.gender);

    if (filters.division) params.append('division', filters.division);
    if (filters.districts) params.append('districts', filters.districts);
    if (filters.upazila) params.append('upazila', filters.upazila);
    if (filters.areas) params.append('areas', filters.areas);

    const base = import.meta.env.VITE_API_URL;
    const apiUrl = `${base}/api/tutors/${params.toString() ? `?${params.toString()}` : ''}`;
    return apiUrl;
  }, []);

  const fetchTutors = useCallback(async (filters: Filters) => {
    try {
      setLoading(true);
      const apiUrl = buildApiUrl(filters);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch tutors: ${response.status}`);
      const data: TutorListResponse = await response.json();
      setTutors(data.results.slice(0, 4));
    } catch {
      toast.error("Failed to load tutors");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [buildApiUrl]);

  useEffect(() => {
    fetchTutors(urlFilters);
  }, [urlFilters, fetchTutors]);

  useEffect(() => {
    const handleTutorSearch = (event: CustomEvent) => {
      const d = event.detail || {};
      const sp = new URLSearchParams(searchParams);
      const setOrDel = (k: string, v?: string) => {
        if (!v) sp.delete(k);
        else sp.set(k, v);
      };
      setOrDel('institution', d.institute || d.institution || '');
      setOrDel('upazila', d.upazila || '');
      setOrDel('subject', d.subject || '');
      setOrDel('gender', d.gender || '');
      setSearchParams(sp, { replace: true });
    };

    window.addEventListener('tutor-search', handleTutorSearch as EventListener);
    return () => window.removeEventListener('tutor-search', handleTutorSearch as EventListener);
  }, [searchParams, setSearchParams]);

  return (
    <div className="w-full mx-auto pa-0">
      <div className="bg-white/5 border-0 backdrop-blur-lg shadow-md transition rounded-3xl overflow-hidden flex flex-col p-4">
        <h2 className="text-2xl font-bold text-white font-unbounded text-center">
          Find A Right Tutor In Your Area
        </h2>
        <p className="text-slate-300/80 mt-2 text-sm text-center pb-5">
          Earn Online and teach thousands of students globally - Get your course
        </p>

        <SearchSection />

        <div className="flex justify-between items-center mb-6 pt-6">
          <h2 className="text-2xl font-bold text-white font-unbounded">Find Tutors</h2>
          <Link to="/guardian/find-tutors" className="text-blue-500 flex items-center hover:underline text-xs">
            View all Tutors <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {loading ? (
            [...Array(4)].map((_, index) => (
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
                  name={`${tutor?.first_name} ${tutor?.last_name}`}
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
    </div>
  );
};

export default TutorSearchResults;
