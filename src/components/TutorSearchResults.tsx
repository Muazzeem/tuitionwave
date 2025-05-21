
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import TutorCard from './TutorCard';
import { Tutor, TutorListResponse } from '@/types/tutor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Card } from './ui/card';

const TutorSearchResults: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const buildApiUrl = () => {
    // Get any search parameters from the URL
    const params = new URLSearchParams();
    
    // Check URL parameters first (these come from direct navigation or refresh)
    if (searchParams.get('institute')) {
      params.append('institute', searchParams.get('institute')!);
    }
    
    if (searchParams.get('city')) {
      params.append('city', searchParams.get('city')!);
    }
    
    if (searchParams.get('subjects')) {
      params.append('subjects', searchParams.get('subjects')!);
    }
    
    if (searchParams.get('gender')) {
      params.append('gender', searchParams.get('gender')!);
    }
    
    return `${import.meta.env.VITE_API_URL}/api/tutors/?${params.toString()}`;
  };

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const apiUrl = buildApiUrl();
      console.log("Fetching tutors from:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tutors: ${response.status}`);
      }
      
      const data: TutorListResponse = await response.json();
      setTutors(data.results.slice(0, 4));
      setError(null);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError('Failed to load tutors. Please try again later.');
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  // Listen for the custom event from SearchSection
  useEffect(() => {
    const handleTutorSearch = (event: CustomEvent) => {
      console.log("Search event received:", event.detail);
      fetchTutors();
    };

    window.addEventListener('tutor-search', handleTutorSearch as EventListener);
    
    return () => {
      window.removeEventListener('tutor-search', handleTutorSearch as EventListener);
    };
  }, []);

  // Fetch tutors on component mount or when URL params change
  useEffect(() => {
    fetchTutors();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Search Results</h2>
        <Link to="/all-tutors" className="text-blue-600 flex items-center hover:underline">
          View all Tutors <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
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
            <TutorCard key={tutor.uid} tutor={tutor} />
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
