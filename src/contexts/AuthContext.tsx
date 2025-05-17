
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken } from '@/utils/auth';
import { ProfileData } from '@/types/common';


interface AuthContextType {
  userProfile: ProfileData | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const profileData = await response.json();
      console.log('Profile data:', profileData);
      setUserProfile(profileData);
      
      // Store profile in sessionStorage for persistence across page refreshes
      sessionStorage.setItem('userProfile', JSON.stringify(profileData));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // Clear stored data on error
      sessionStorage.removeItem('userProfile');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear profile (used during logout)
  const clearProfile = () => {
    setUserProfile(null);
    localStorage.clear();
    sessionStorage.removeItem('userProfile');
  };

  // Try to load profile from sessionStorage on mount
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    const accessToken = getAccessToken();
    
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
        setLoading(false);
      } catch (e) {
        sessionStorage.removeItem('userProfile');
        setLoading(false);
      }
    } else if (accessToken) {
      // If we have a token but no stored profile, try to fetch the profile
      fetchProfile();
    } else {
      // No token and no profile, we're not authenticated
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        loading,
        error,
        fetchProfile,
        clearProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
