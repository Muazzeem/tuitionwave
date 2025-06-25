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
      setError(null); // Clear any previous errors
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tutors/profile-completion`,
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
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfileCompletion = async () => {
    try {
      return await fetchCompletionData();
    } catch (error) {
      console.error("Error refreshing profile completion:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCompletionData();
  }, []);

  const contextValue = {
    completionData,
    loading,
    error,
    refresh: fetchCompletionData,
    refreshProfileCompletion,
    updateCompletionData: setCompletionData,
  };

  return (
    <ProfileCompletionContext.Provider value={contextValue}>
      {children}
    </ProfileCompletionContext.Provider>
  );
};

export const useProfileCompletion = () => {
  const context = useContext(ProfileCompletionContext);
  if (!context) {
    throw new Error('useProfileCompletion must be used within a ProfileCompletionProvider');
  }
  return context;
};