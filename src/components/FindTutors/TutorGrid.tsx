
import React from 'react';
import TutorCard from './TutorCard';

const tutors = [
  {
    name: "Tutor Name",
    university: "Dhaka University",
    monthlyRate: 300,
    rating: 4.9,
    reviewCount: 60,
    image: "/lovable-uploads/cf62570b-bbe3-4358-8fd5-ce186e9f011a.png"
  },
  // ... Add more mock tutors as needed
];

const TutorGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {tutors.map((tutor, index) => (
        <TutorCard
          key={index}
          {...tutor}
        />
      ))}
    </div>
  );
};

export default TutorGrid;
