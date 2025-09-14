import React, { useState, useEffect } from "react";
import { MapPin, Star, GraduationCap } from "lucide-react";
import TutorDetailsModal from "./TutorDetailsModal";

interface TutorCardProps {
  name: string;
  university: string;
  division: string;
  upazila: string;
  district: string;
  monthlyRate: string;
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
  const locationText = [upazila, district, division].filter(Boolean).join(", ");
  const subjectsFallback = "English · Bangla · Math";
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetailsModal(true)}
        className={[
          "relative overflow-hidden rounded-3xl cursor-pointer",
          "bg-slate-800/40 backdrop-blur-md",
          "border border-white/10",
          "shadow-lg hover:shadow-2xl",
          "transition-all duration-300 hover:-translate-y-0.5",
        ].join(" ")}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="h-48 w-full object-cover"
            loading="lazy"
          />

          {teaching_type && (
            <span
              className={[
                "absolute left-4 top-4 z-10",
                "rounded-full px-3 py-2",
                "text-white text-xs",
                "bg-gradient-to-b from-blue-500 to-blue-600",
              ].join(" ")}
            >
              <span
                className="capitalize"
              >{teaching_type}</span>
            </span>
          )}

          {/* Bottom gradient overlay */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28
                       bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent"
          />
        </div>

        {/* Body */}
        <div className="relative -mt-6 px-5 pb-5">
          {/* University */}
          <div className="flex items-center text-slate-300/85 text-sm mb-1">
            <GraduationCap className="mr-2 h-4 w-4 opacity-80" />
            <span className="truncate">{university}</span>
          </div>

          {/* Name */}
          <h3 className="text-white text-lg font-semibold leading-tight mb-2 line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center text-slate-300/90 text-sm mb-2">
            <MapPin className="mr-2 h-4 w-4 opacity-90" />
            <span className="truncate text-xs">{locationText || "Address not specified"}</span>
          </div>
          <p className="text-slate-300/90 text-xs mb-5">{subjectsFallback}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-200">
              <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {Number.isFinite(rating) ? rating.toFixed(1) : "—"}
              </span>
              <span className="ml-1 text-slate-400 text-base text-sm">
                ({reviewCount ?? 0})
              </span>
            </div>
            <span
              className={[
                "rounded-full px-3 py-2",
                "text-white text-xs",
                "bg-blue-600",
                "whitespace-nowrap",
              ].join(" ")}
            >
              {monthlyRate}
            </span>
          </div>
        </div>

        {/* subtle outer ring */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
      </div>

      <TutorDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onConfirm={() => setShowDetailsModal(false)}
        uid={uid}
      />
    </>
  );
};

export default TutorCard;
