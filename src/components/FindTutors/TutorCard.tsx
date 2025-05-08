import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import TutorDetailsDrawer from "@/components/TutorDetailsDrawer";
import { Badge } from "../ui/badge";

interface TutorCardProps {
  name: string;
  university: string;
  division: string;
  monthlyRate: number;
  teaching_type: string;
  rating: number;
  reviewCount: number;
  image: string;
  uid: string;
}

const TutorCard: React.FC<TutorCardProps> = ({
  name,
  university,
  division,
  monthlyRate,
  teaching_type,
  rating,
  reviewCount,
  image,
  uid,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isDrawerOpen]);

  const openDrawer = (e: React.MouseEvent) => {
    // Don't open drawer if clicking on the button
    if (!(e.target as HTMLElement).closest("a")) {
      setIsDrawerOpen(true);
      // Add class to prevent scrolling
      document.body.classList.add("overflow-hidden");
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Remove class to allow scrolling again
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <>
      <div
        className="bg-white rounded-lg overflow-hidden cursor-pointer"
        onClick={openDrawer}
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
          <h3 className="text-lg font-semibold mt-1 text-shadow-lg">{name}</h3>
          <div className="flex items-center gap-1 mt-2 mb-5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="text-blue-600 text-sm">
                ({reviewCount} reviews)
              </span>
          </div>
          <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-dark-400" />
              <span className="font-medium">{division}</span>
          </div>
            <div className="ml-auto flex gap-2">
              {teaching_type === "ONLINE" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-lg">
                  Online
                </Badge>
              )}
              {teaching_type === "HOME" && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg">
                  Home
                </Badge>
              )}
              {teaching_type === "BOTH" && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg">
                  Online & Home
                </Badge>
              )}
            </div>
          </div>
          <Button
            className="w-full text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 uppercase"
            onClick={openDrawer}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Tutor Details Drawer */}
      <TutorDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        uid={uid}
      />
    </>
  );
};

export default TutorCard;
