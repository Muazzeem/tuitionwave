import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken, isTokenExpired, refreshAccessToken } from '@/utils/auth';
import { ProfileData } from '@/types/common';

interface AuthContextType {
  userProfile: ProfileData | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  reloadProfile: () => Promise<void>; 
  clearProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isTokenExpired()) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          throw new Error('Failed to refresh token');
        }
      }

      const accessToken = getAccessToken();
      if (!accessToken) throw new Error('No access token found');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        localStorage.clear();
      }

      const profileData = await response.json();
      setUserProfile(profileData);
      sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (err) {
      console.error('Profile fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUserProfile(null);
      sessionStorage.removeItem('userProfile');
    } finally {
      setLoading(false);
    }
  };

  const reloadProfile = async () => {
    setUserProfile(null);
    sessionStorage.removeItem('userProfile');
    await fetchProfile();
  };

  const clearProfile = () => {
    setUserProfile(null);
    localStorage.clear();
    sessionStorage.removeItem('userProfile');
  };

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    const accessToken = getAccessToken();

    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
        setLoading(false);
      } catch {
        sessionStorage.removeItem('userProfile');
        setLoading(false);
      }
    } else if (accessToken) {
      fetchProfile();
    } else {
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
        reloadProfile,
        clearProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
