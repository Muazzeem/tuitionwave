import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tutor, TutorListResponse } from '@/types/tutor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Card } from './ui/card';
import TutorCard from './FindTutors/TutorCard';

const TutorSearchResults: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [searchFilters, setSearchFilters] = useState({
    institute: searchParams.get('institute') || '',
    upazila: searchParams.get('upazila') || '',
    subject: searchParams.get('subject') || '',
    gender: searchParams.get('gender') || ''
  });

  const buildApiUrl = (filters: any) => {
    // Get any search parameters from the URL
    const params = new URLSearchParams();

    if (filters.institute) {
      params.append('institute', filters.institute);
    }

    if (filters.upazila) {
      params.append('upazila', filters.upazila);
    }

    if (filters.subject) {
      params.append('subjects', filters.subject); // Backend expects 'subjects'
    }

    if (filters.gender) {
      params.append('gender', filters.gender);
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/tutors/?${params.toString()}`;
    console.log("Built API URL:", apiUrl);
    return apiUrl;
  };

  const fetchTutors = async (filters: any) => {
    try {
      setLoading(true);
      const apiUrl = buildApiUrl(filters);
      console.log("Fetching tutors with filters:", filters);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch tutors: ${response.status}`);
      }

      const data: TutorListResponse = await response.json();
      setTutors(data.results.slice(0, 4));
    } catch (err) {
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  // Listen for the custom event from SearchSection
  useEffect(() => {
    const handleTutorSearch = (event: CustomEvent) => {
      const eventDetail = event.detail;
      console.log("Search event received:", eventDetail);

      // Update our filters with the new search criteria
      const newFilters = {
        institute: eventDetail.institute || '',
        upazila: eventDetail.upazila || '',
        subject: eventDetail.subject || '',
        gender: eventDetail.gender || ''
      };

      setSearchFilters(newFilters);
      fetchTutors(newFilters);
    };

    window.addEventListener('tutor-search', handleTutorSearch as EventListener);

    return () => {
      window.removeEventListener('tutor-search', handleTutorSearch as EventListener);
    };
  }, []);

  // Fetch tutors on component mount or when URL params change
  useEffect(() => {
    const urlFilters = {
      institute: searchParams.get('institute') || '',
      upazila: searchParams.get('upazila') || '',
      subject: searchParams.get('subject') || '',
      gender: searchParams.get('gender') || ''
    };

    setSearchFilters(urlFilters);
    fetchTutors(urlFilters);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Search Results</h2>
        <Link to="/guardian/find-tutors" className="text-primary flex items-center hover:underline">
          View all Tutors <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {loading ? (
          // Loading skeletons
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <div className="p-3">
                <Skeleton className="h-48 w-full mb-3" />
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))
        ) : tutors.length > 0 ? (
          // Display tutors
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
          // No tutors found
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No tutors found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSearchResults;