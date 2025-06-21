import React, { useState, useEffect } from "react";
import { MapPin, Star, GraduationCap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import TutorDetailsDrawer from "@/components/TutorDetailsDrawer";
import { Badge } from "../ui/badge";

interface TutorCardProps {
  name: string;
  university: string;
  division: string;
  upazila: string;
  district: string;
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
  upazila,
  district,
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
    if (!(e.target as HTMLElement).closest("button")) {
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


  const getTeachingTypeBadge = () => {
    switch (teaching_type) {
      case "ONLINE":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full text-xs font-medium border-0">
            🌐 Online
          </Badge>
        );
      case "OFFLINE":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-full text-xs font-medium border-0">
            🏠 Home Visit
          </Badge>
        );
      case "BOTH":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-xs font-medium border-0">
            🌐 Online & Home
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden cursor-pointer dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
        onClick={openDrawer}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden" style={{ paddingBottom: "50%" }}>
          <img
            src={image}
            alt={name}
            className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            {getTeachingTypeBadge()}
          </div>
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-gray-800">{rating}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* University */}
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <p className="text-blue-600 text-sm font-medium dark:text-blue-400 truncate">
              {university}
            </p>
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize mb-3 line-clamp-1">
            {name}
          </h3>

          {/* Location Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 dark:text-white" />
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {district}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {upazila} • {division}
                </div>
              </div>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800 dark:text-white">{rating}</span>
              </div>
              <span className="text-gray-500 text-sm dark:text-gray-400">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
            <span className="font-bold text-green-700 dark:text-green-400 text-sm">
              {monthlyRate.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Tutor Details Drawer */}
      <TutorDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        uid={uid}
        image={image}
        teaching_type={teaching_type}
      />
    </>
  );
};

export default TutorCard;