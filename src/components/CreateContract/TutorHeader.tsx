
import React from "react";
import { Star } from "lucide-react";

interface TutorHeaderProps {
  name?: string;
  rating?: number;
  reviewCount?: number;
}

const TutorHeader: React.FC<TutorHeaderProps> = ({
  name,
  rating = 4.0,
  reviewCount = 20,
}) => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6">{name}</h2>

      <div className="flex items-center gap-2 mb-5 mt-2">
        <div className="flex items-center text-yellow-400">
          {Array.from({ length: Math.floor(rating || 4) }).map((_, index) => (
            <Star key={index} className="w-5 h-5 fill-current" />
          ))}
          <span className="ml-1 text-black">{rating?.toFixed(1) || "4.0"}</span>
        </div>
        <span className="text-gray-500">({reviewCount || 20} reviews)</span>
      </div>
    </>
  );
};

export default TutorHeader;
