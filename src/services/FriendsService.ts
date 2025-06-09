
import axios from 'axios';
import { FriendsApiResponse } from '@/types/friends';
import { getAccessToken } from '@/utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

const FriendsService = {
  getFriends: async (): Promise<FriendsApiResponse> => {
    try {
      const accessToken = getAccessToken();
      const response = await axios.get(`${API_URL}/api/friends/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Return empty response structure on error
      return {
        accepted_friends: []
      };
    }
  }
};

export default FriendsService;
