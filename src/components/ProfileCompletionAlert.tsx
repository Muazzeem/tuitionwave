import { getAccessToken } from "@/utils/auth";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";

export interface ProfileCompletionAlertRef {
  reload: () => void;
}

const ProfileCompletionAlert = forwardRef<ProfileCompletionAlertRef>((props, ref) => {
  const [completionData, setCompletionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = getAccessToken();



  const fetchCompletionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tutors/profile-completion/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile completion data");
      }

      const data = await response.json();
      setCompletionData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // expose reload function to parent
  useImperativeHandle(ref, () => ({
    reload: fetchCompletionData,
  }));

  useEffect(() => {
    fetchCompletionData();
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 md:p-4 mb-4 md:mb-6">
        <p className="text-sm md:text-base">Loading profile completion data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 md:p-4 mb-4 md:mb-6">
        <p className="text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (!completionData) return null;

  const { completion_percentage } = completionData;

  return (
    <div
      className={`bg-background border-l-4 border-${completion_percentage < 80 ? "red" : "green"
        }-500 p-3 md:p-4 mb-4 md:mb-6 text-white shadow-md rounded-xl`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
        <div className="flex items-center">
          {completion_percentage < 80 ? (
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-5a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0-4a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm8-3a1 1 0 00-1-1H9a1 1 0 000 2h6a1 1 0 001-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <h3 className="font-bold text-base leading-tight">
            {completion_percentage < 80
              ? "Complete your tutor profile & unlock your potential!"
              : "Your profile is almost complete!"}
          </h3>
        </div>
        <div className="text-left sm:text-right font-bold text-xs sm:text-base flex-shrink-0 font-unbounded">
          {completion_percentage}% Complete
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-3">
        <div
          className={`bg-${completion_percentage < 80 ? "red" : "green"
            }-600 h-2 sm:h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${completion_percentage}%` }}
        ></div>
      </div>

      <p className="mb-2 text-sm sm:text-base leading-relaxed text-gray-400">
        {completion_percentage < 80
          ? "Showcase your expertise, attract more students, and stand out by finishing your profile setup!"
          : "You're doing great! Your profile is complete and ready to be shared with potential students."}
      </p>
    </div>
  );
});

export default ProfileCompletionAlert;
