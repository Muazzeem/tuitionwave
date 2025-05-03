// src/components/ProfileCompletionAlert.jsx

import React, { useState } from "react";
import { useProfileCompletion } from "@/components/ProfileCompletionContext";

const ProfileCompletionAlert = () => {
  const { completionData, loading, error } = useProfileCompletion();
  const [showMissingFields, setShowMissingFields] = useState(false);

  const formatFieldName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace("Url", "")
      .replace("Display", "");
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <p>Loading profile completion data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>Error loading profile completion data. Please try again later.</p>
      </div>
    );
  }

  const { completion_percentage, missing_fields } = completionData;

  return (
    <div
      className={`bg-${
        completion_percentage < 80 ? "red" : "green"
      }-50 border-l-4 border-${
        completion_percentage < 80 ? "red" : "green"
      }-500 text-${completion_percentage < 80 ? "red" : "green"}-700 p-4 mb-6`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {completion_percentage < 80 ? (
            <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
            <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-5a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0-4a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm8-3a1 1 0 00-1-1H9a1 1 0 000 2h6a1 1 0 001-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <h3 className="font-bold text-lg">
            {completion_percentage < 80
              ? "Complete Your Tutor Profile & Unlock Your Potential!"
              : "Your profile is almost complete!"}
          </h3>
        </div>
        <div className="text-right font-bold">
          {completion_percentage}% Complete
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div
          className={`bg-${
            completion_percentage < 80 ? "red" : "green"
          }-600 h-2.5 rounded-full`}
          style={{ width: `${completion_percentage}%` }}
        ></div>
      </div>

      <p className="mb-2">
        {completion_percentage < 80
          ? "Showcase your expertise, attract more students, and stand out by finishing your profile setup!"
          : "You're doing great! Just a few more details to make your profile perfect."}
      </p>

      {missing_fields.length > 0 && (
        <div>
          <button
            onClick={() => setShowMissingFields(!showMissingFields)}
            className={`font-medium hover:underline text-${
              completion_percentage < 80 ? "red" : "green"
            }-700 flex items-center`}
          >
            {showMissingFields ? "Hide" : "Show"} missing fields
            <svg
              className={`ml-1 h-4 w-4 transform ${
                showMissingFields ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showMissingFields && (
            <ul className="mt-2 list-disc list-inside">
              {missing_fields.map((field, index) => (
                <li key={index}>
                  {formatFieldName(field.name)}{" "}
                  <span className="text-sm text-gray-500">
                    ({field.weight} points)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionAlert;
