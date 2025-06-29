import React, { useState, useEffect } from "react";

import { Tutor } from "@/types/tutor";


const TutorCard: React.FC<{ tutor: Tutor }> = ({ tutor }) => {
  const rating = tutor.avg_rating || 0;
  const totalRatings = tutor.review_count || 0;

  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ));

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <img
            src={tutor.profile_picture || "https://via.placeholder.com/100"}
            alt={`${tutor.first_name} ${tutor.last_name}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium">{`${tutor.first_name} ${tutor.last_name}`}</p>
          <p className="text-xs text-gray-500">{tutor.institute?.name}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end">{stars}</div>
        <p className="text-xs text-gray-500">
          {rating.toFixed(1)} ({totalRatings})
        </p>
      </div>
    </div>
  );
};

const TopTutors: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTutors(data.results);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return <div>Loading top tutors...</div>;
  }

  if (error) {
    return <div>Error loading tutors: {error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-none border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">New Tutors</h2>
        <button className="text-sm text-tuitionwave-blue hover:underline">
          View All
        </button>
      </div>

      <div className="dark:divide-gray-700">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.uid} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};

export default TopTutors;
