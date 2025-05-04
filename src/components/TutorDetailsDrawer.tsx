
import React from "react";
import { Link } from 'react-router-dom';
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TutorDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  university: string;
  monthlyRate: number;
  rating: number;
  reviewCount: number;
  image: string;
  uid: string;
}

const TutorDetailsDrawer: React.FC<TutorDetailsDrawerProps> = ({
  isOpen,
  onClose,
  name,
  university,
  monthlyRate,
  rating,
  reviewCount,
  image,
  uid,
}) => {
  // Handle clicks inside the drawer to prevent propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-1/2 lg:max-w-md transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div 
          className="h-full flex flex-col bg-white shadow-xl overflow-y-auto"
          onClick={stopPropagation}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Tutor Details</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 md:p-6 flex-grow overflow-y-auto">
            <img
              src={image}
              alt={name}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-gray-600">{university}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span>({reviewCount} reviews)</span>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Monthly Rate: <span className="text-gray-900">{monthlyRate}</span></p>
                
                <h4 className="font-medium mt-4">About Tutor</h4>
                <p className="text-gray-700">
                  Experienced tutor specializing in helping students excel in their studies.
                  Personalized teaching approach that adapts to each student's unique learning style.
                </p>
                
                <h4 className="font-medium mt-4">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Mathematics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Physics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Chemistry</span>
                </div>

                <h4 className="font-medium mt-4">Location</h4>
                <p className="text-gray-700">Rajshahi</p>

                <h4 className="font-medium mt-4">Availability</h4>
                <p className="text-gray-700">Online, Home</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <Link to={`/create-contract/${uid}`} onClick={onClose}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                REQUEST THIS TUTOR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorDetailsDrawer;
