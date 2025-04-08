
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TutorCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-100">
        <img 
          src="/lovable-uploads/cf414f3f-8759-4490-a410-9d240c081e20.png" 
          alt="Tutor" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">Dhaka University</p>
        <h3 className="text-lg font-medium mb-1">Mostafizur Rahman</h3>
        <div className="flex items-center mb-1">
          <div className="flex mr-1">
            {[1, 2, 3, 4].map((_, index) => (
              <Star key={index} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
            <Star size={14} className="text-yellow-400 fill-transparent" />
          </div>
          <span className="text-xs text-gray-500">(90 reviews)</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-1" />
            <span className="text-xs">Rajshahi</span>
          </div>
          <div className="flex space-x-1">
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Online</span>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Offline</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-blue-600 font-bold">$30/Hour</p>
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            REQUEST TUTOR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
