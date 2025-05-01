import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Star, X } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    // Don't open modal if clicking on the button
    if (!(e.target as HTMLElement).closest('a')) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
        onClick={openModal}
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
          <Link to={`/tutor/${uid}`} onClick={stopPropagation}>
            <Button className="w-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50">
              REQUEST TUTOR
            </Button>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={stopPropagation}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{name}</h2>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
                
                <div className="md:w-2/3 space-y-4">
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
                  </div>
                  
                  <div className="pt-4">
                    <Link to={`/tutor/${uid}`} onClick={closeModal}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        REQUEST THIS TUTOR
                      </Button>
                    </Link>
                  </div>
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
