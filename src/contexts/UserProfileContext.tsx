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
  division?: {
    id: number;
    name: string;
  };
  preferred_districts?: Array<{
    id: number;
    name: string;
    division: {
      id: number;
      name: string;
    };
  }>;
  preferred_upazila?: Array<{
    id: number;
    name: string;
    district: {
      id: number;
      name: string;
      division: {
        id: number;
        name: string;
      };
    };
  }>;
  preferred_areas?: Array<{
    id: number;
    name: string;
  }>;
}

interface UserProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData> | FormData) => Promise<void>;
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

      const storedProfile = sessionStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setLoading(false);
        return;
      }

      // If not, fetch from API
      const token = getAccessToken();
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData: ProfileData = {
        ...response.data,
        is_nid_verified: response.data.is_nid_verified ?? false,
      };

      setProfile(profileData);
      sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load user profile');
      sessionStorage.removeItem('userProfile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData> | FormData) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const isFormData = data instanceof FormData;

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
      });

      // Merge and store updated profile
      setProfile((prev) => {
        const updated = prev ? { ...prev, ...response.data } : response.data;
        sessionStorage.setItem('userProfile', JSON.stringify(updated));
        return updated;
      });
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
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile: fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContext;
