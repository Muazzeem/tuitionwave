
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TutorCard from './TutorCard';
import TutorPagination from './TutorPagination';
import { toast } from 'sonner';

const TutorGrid = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0
  });

  const buildApiUrl = (page = 1) => {
    // Start with the base URL and page parameter
    const params = new URLSearchParams(`page=${page}`);
    
    // Add any search filters from URL parameters
    if (searchParams.get('search')) {
      params.append('search', searchParams.get('search'));
    }
    if (searchParams.get('institute')) {
      params.append('institute', searchParams.get('institute'));
    }
    
    if (searchParams.get('preferred_upazila')) {
      params.append('preferred_upazila', searchParams.get('preferred_upazila'));
    }
    
    if (searchParams.get('subjects')) {
      params.append('subjects', searchParams.get('subjects'));
    }
    
    if (searchParams.get('gender')) {
      params.append('gender', searchParams.get('gender'));
    }
    if (searchParams.get('teaching_type')) {
      params.append('teaching_type', searchParams.get('teaching_type'));
    }
    return `${import.meta.env.VITE_API_URL}/api/tutors/?${params.toString()}`;
  };

  const fetchTutors = async (page = 1) => {
    try {
      setLoading(true);
      const apiUrl = buildApiUrl(page);
      console.log("Fetching tutors from:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTutors(data.results);
      setPagination({
        currentPage: data.current_page || 1,
        totalPages: data.total_pages || 1,
        count: data.count || 0
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tutors:', err);
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [searchParams]);

  const handlePageChange = (page) => {
    fetchTutors(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-gray-600">Loading tutors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-red-600">Error loading tutors: {error}</p>
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-gray-600">No tutors found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {tutors.map((tutor) => (
          <TutorCard
            key={tutor.uid}
            uid={tutor.uid}
            name={`${tutor.first_name} ${tutor.last_name}`}
            teaching_type={tutor.teaching_type}
            university={tutor.institute ? tutor.institute.name : 'Not specified'}
            division={tutor.division ? tutor.division.name : 'Not specified'}
            monthlyRate={tutor.expected_salary ? tutor.expected_salary.display_range : 'Not specified'}
            rating={4.5}
            reviewCount={0}
            image={tutor.profile_picture || '/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png'}
          />
        ))}
      </div>
      
      <TutorPagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TutorGrid;
