
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorCardProps {
  name: string;
  university: string;
  monthlyRate: number;
  rating: number;
  reviewCount: number;
  image: string;
}

const TutorCard: React.FC<TutorCardProps> = ({
  name,
  university,
  monthlyRate,
  rating,
  reviewCount,
  image,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-w-4 aspect-h-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm">{university}</p>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <p className="text-gray-900 font-medium mt-1">৳{monthlyRate}/Month</p>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
        </div>
        <Button className="w-full mt-4" variant="outline">
          REQUEST TUTOR
        </Button>
      </div>
    </div>
  );
};

export default TutorCard;
