
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from './ui/card';
import { Tutor } from '@/types/tutor';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const fullName = `${tutor.first_name} ${tutor.last_name}`;
  const profileImage = tutor.profile_picture || "/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png";
  // const teachingRate = tutor.teaching_rate.toLocaleString();
  const teaching_type = tutor.teaching_type;

  return (
    <Card>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-3 dark:bg-gray-900">
        <div className="h-48 bg-gray-100">
          <img
            src={profileImage}
            alt={fullName}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500 dark:text-white">{tutor.collage_name}</p>
          <h3 className="text-2xl font-bold text-gray-900 my-1 dark:text-white">{fullName}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Star size={24} className="text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-medium dark:text-white">4.9</span>
            <span className="text-gray-500 dark:text-white">(60 reviews)</span>
            <span className="ml-auto text-sm font-bold dark:text-white">৳10000/Hour</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-gray-700 dark:text-white" />
            <span className="text-gray-700 dark:text-white">{tutor.address || "Not specified"}</span>
            <div className="ml-auto flex gap-2">
              {teaching_type === 'ONLINE' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Online</Badge>}
              {teaching_type === 'HOME' && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Home</Badge>}
              {teaching_type === 'BOTH' && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Online & Home</Badge>}
            </div>
          </div>

          <Link to={`/tutor/${tutor.uid}`}>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white"
            >
              REQUEST TUTOR
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TutorCard;
