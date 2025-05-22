
import axios from 'axios';
import { FriendsApiResponse } from '@/types/friends';

const API_URL = import.meta.env.VITE_API_URL;

const FriendsService = {
  getFriends: async (page = 1): Promise<FriendsApiResponse> => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/friends?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Return empty response structure on error
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }
};

export default FriendsService;
