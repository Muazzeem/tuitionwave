import { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
import TutorPagination from './TutorPagination';

const TutorGrid = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0
  });

  const fetchTutors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/tutors/?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTutors(data.results);
      setPagination({
        currentPage: data.current_page,
        totalPages: data.total_pages,
        count: data.count
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tutors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

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