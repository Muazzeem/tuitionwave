
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TutorCard from './TutorCard';

const TutorSearchResults: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tutor Search Result</h2>
        <Link to="/all-tutors" className="text-blue-600 flex items-center hover:underline">
          View all Tutors <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {[...Array(8)].map((_, index) => (
          <TutorCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default TutorSearchResults;
