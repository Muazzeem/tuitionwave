import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isSidebarOpen]);
  
  const openSidebar = (e: React.MouseEvent) => {
    // Don't open sidebar if clicking on the button
    if (!(e.target as HTMLElement).closest('a')) {
      setIsAnimating(true);
      setIsSidebarOpen(true);
      // Add class to prevent scrolling
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeSidebar = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsAnimating(false);
      // Remove class to allow scrolling again
      document.body.classList.remove('overflow-hidden');
    }, 300); // Match this with the transition duration
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
        onClick={openSidebar}
      >
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
            <Button className="w-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 uppercase"
              onClick={openSidebar}
              >
             View Details
            </Button>
        </div>
      </div>

      {/* Side Drawer Modal */}
      {(isSidebarOpen || isAnimating) && (
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div
            className={cn(
              "bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-500 relative",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={stopPropagation}
          />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            {/* Sliding sidebar panel */}
            <div 
              className={cn(
                "w-screen max-w-md transform transition-transform duration-300 ease-in-out", 
                isSidebarOpen ? "translate-x-0" : "translate-x-full"
              )}
              onClick={stopPropagation}
            >
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold">Tutor Details</h2>
                  <button 
                    onClick={closeSidebar}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 flex-grow overflow-y-auto">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
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
                  <Link to={`/create-contract/${uid}`} onClick={closeSidebar}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      REQUEST THIS TUTOR
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorCard;