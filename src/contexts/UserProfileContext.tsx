
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/auth';

export interface ProfileData {
  uid: string;
  username: string | null;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone: string;
  address: string;
  profile_picture: string | null;
  date_joined: string;
  is_nid_verified?: boolean;
}

interface UserProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAccessToken();
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add default values for properties that might be missing
      const profileData = {
        ...response.data,
        is_nid_verified: response.data.is_nid_verified ?? false,
      };
      
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProfile(prev => prev ? { ...prev, ...response.data } : response.data);
      return Promise.resolve();
    } catch (err) {
      console.error('Failed to update user profile:', err);
      setError('Failed to update user profile');
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{
      profile,
      loading,
      error,
      refreshProfile: fetchProfile,
      updateProfile
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContext;
