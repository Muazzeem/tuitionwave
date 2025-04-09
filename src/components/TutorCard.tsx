
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from './ui/card';

const TutorCard: React.FC = () => {
  return (
    <Card>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-3">
        <div className="h-48 bg-gray-100">
          <img
            src="/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png"
            alt="Tutor"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Dhaka University</p>
          <h3 className="text-2xl font-bold text-gray-900 my-1">Mostafizur Rahman</h3>
          <div className="flex items-center gap-2 mb-2">
            <Star size={24} className="text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-medium">4.9</span>
            <span className="text-gray-500">(60 reviews)</span>
            <span className="ml-auto text-sm font-bold">$30/Hour</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-gray-700" />
            <span className="text-gray-700">Rajshahi</span>
            <div className="ml-auto flex gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Online</Badge>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Home</Badge>
            </div>
          </div>

          <Link to="/tutor/mamun">
            <Button
              className="w-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50"
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
