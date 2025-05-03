import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "@/utils/auth";

const ProfileCompletionContext = createContext();

export const ProfileCompletionProvider = ({ children }) => {
  const [completionData, setCompletionData] = useState({
    completion_percentage: 0,
    completed_weight: 0,
    total_weight: 100,
    completed_fields: [],
    missing_fields: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompletionData = async () => {
    const accessToken = getAccessToken();
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:8000/api/tutors/profile-completion",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile completion data");
      }
      const data = await response.json();
      setCompletionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletionData();
  }, []);

  return (
    <ProfileCompletionContext.Provider
      value={{ completionData, loading, error, refresh: fetchCompletionData }}
    >
      {children}
    </ProfileCompletionContext.Provider>
  );
};

// Custom hook for easy access
export const useProfileCompletion = () => useContext(ProfileCompletionContext);
