import React from "react";
import { Link } from 'react-router-dom';

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorCardProps {
  name: string;
  university: string;
  monthlyRate: number;
  rating: number;
  reviewCount: number;
  image: string;
  uid: string;
}

const TutorCard: React.FC<TutorCardProps> = ({
  name,
  university,
  monthlyRate,
  rating,
  reviewCount,
  image,
  uid,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-100" style={{ paddingBottom: "56.25%" }}>
        <img
          src={image}
          alt={name}
          className="absolute top-0 left-0 h-full w-full object-cover p-3"
        />
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm">{university}</p>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <p className="text-gray-900 font-medium mt-1">{monthlyRate}/Month</p>
        <div className="flex items-center gap-1 mt-2 mb-5">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-blue-600 text-sm">({reviewCount} reviews)</span>
        </div>
        <Link to={`/tutor/${uid}`}>
          <Button className="w-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50">
            REQUEST TUTOR
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;
