import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ContactTutorDrawer from "@/components/ContactTutorDrawer";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tutor } from "@/types/tutor";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import ReviewSection from "./ReviewSection";

interface TutorDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  image: string;
}

const TutorDetailsDrawer: React.FC<TutorDetailsDrawerProps> = ({
  isOpen,
  onClose,
  uid,
  image,
}) => {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [tutorDetails, setTutorDetails] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openContactDrawer = () => {
    onClose();
    setIsContactDrawerOpen(true);
  };

  const closeContactDrawer = () => {
    setIsContactDrawerOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const fetchTutorDetails = async () => {
      if (!uid) return;

      if (tutorDetails && tutorDetails.uid === uid) return;

      setTutorDetails(null);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tutors/${uid}`);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorMessage}`
          );
        }
        const data: Tutor = await response.json();
        setTutorDetails(data);
      } catch (e: any) {
        setError("Failed to load tutor details.");
        console.error("Error fetching tutor details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTutorDetails();
    } else {
      setTutorDetails(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, uid]);

  return (
    <>
      {/* Overlay for TutorDetailsDrawer */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Tutor Details Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full md:w-1/2 lg:w-1/3 transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div
          className="h-full flex flex-col bg-white shadow-xl overflow-y-auto dark:bg-gray-900"
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
            {image || tutorDetails?.profile_picture ? (
              <img
                src={image}
                alt={`${tutorDetails?.full_name}'s profile`}
                className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
              />
            ) : (
              <div className="w-full h-48 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125a.75.75 0 01-.75-.75V11.25a.75.75 0 01.75-.75h15.002a.75.75 0 01.75.75v8.125a.75.75 0 01-.75.75H4.501z"
                  />
                </svg>
              </div>
            )}
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="w-32 h-8" /> {/* Skeleton for name */}
                <div className="space-y-2">
                  <h4 className="font-medium mt-4">
                    <Skeleton className="w-24 h-5" />
                  </h4>{" "}
                  {/* Skeleton for "About Tutor" */}
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 w-4/5" />
                  {/* Add more skeletons for other loading elements */}
                  <div>
                    <h4 className="font-medium text-base mt-4">
                      <Skeleton className="w-20 h-5" />
                    </h4>{" "}
                    {/* Skeleton for "Subjects" */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Skeleton className="w-16 h-6 rounded-lg" />
                      <Skeleton className="w-12 h-6 rounded-lg" />
                      {/* Add more skeleton subject pills as needed */}
                    </div>
                  </div>
                  <h4 className="font-medium mt-4">
                    <Skeleton className="w-16 h-5" />
                  </h4>{" "}
                  {/* Skeleton for "Location" */}
                  <Skeleton className="h-4 w-28" />
                  <div>
                    <h4 className="font-medium text-base mt-4">
                      <Skeleton className="w-24 h-5" />
                    </h4>{" "}
                    {/* Skeleton for "Availability" */}
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : tutorDetails ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {tutorDetails.full_name}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {tutorDetails.subjects &&
                    tutorDetails.subjects.length > 0 && (
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Subjects</span>
                        </div>
                        <div className="ml-auto flex gap-2">
                          {tutorDetails.subjects.map((subject) => (
                            <span
                              key={subject.id}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm"
                            >
                              {subject.subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}


                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Preferred Time</span>
                        </div>
                        <div className="ml-auto flex gap-2">
                        {tutorDetails?.preferred_time}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Availability Days</span>
                        </div>
                        <div className="ml-auto flex gap-2">
                        {tutorDetails.active_days &&
                        tutorDetails.active_days.length > 0 && (
                          <span>
                            {" "}
                            {tutorDetails.active_days
                              .map((day) => day.day)
                              .join(", ")}
                          </span>
                        )}
                        </div>
                      </div>

                  <div>
                    <div className="text-gray-700 mt-1 dark:text-gray-300">
                      
                      {tutorDetails.days_per_week !== null && (
                        <p>Per Week: {tutorDetails.days_per_week}</p>
                      )}
                      <ReviewSection id={uid} condition='False' />
                      {(tutorDetails.active_days === null ||
                        tutorDetails.active_days.length === 0) &&
                        tutorDetails.days_per_week === null &&
                        !tutorDetails.teaching_type_display && (
                          <p>Availability information not specified</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {tutorDetails && !loading && !error && (
            <div className="p-4 border-t">
              <Button onClick={openContactDrawer} className="w-full min-h-[55px] dark:text-white">
                Contact Tutor
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Tutor Drawer */}
      <ContactTutorDrawer
        isOpen={isContactDrawerOpen}
        onClose={closeContactDrawer}
        uid={uid}
      />
    </>
  );
};

export default TutorDetailsDrawer;
