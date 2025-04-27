// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken } from '@/utils/auth';

// Define the profile interface based on your API response
interface UserProfile {
  uid: string;
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  // Add other fields that come from your profile API
}

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const profileData = await response.json();
      setUserProfile(profileData);
      
      // Store profile in sessionStorage for persistence across page refreshes
      sessionStorage.setItem('userProfile', JSON.stringify(profileData));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear profile (used during logout)
  const clearProfile = () => {
    setUserProfile(null);
    localStorage.clear()
    sessionStorage.removeItem('userProfile');
  };

  // Try to load profile from sessionStorage on mount
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        sessionStorage.removeItem('userProfile');
      }
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