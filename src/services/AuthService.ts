
import { refreshAccessToken, isTokenExpired, isAuthenticated, getAccessToken } from '@/utils/auth';

/**
 * Service to handle authentication-related operations
 */
class AuthService {
  /**
   * Checks and refreshes the token if needed
   * @returns True if the user has a valid token after the operation
   */
  static async ensureValidToken(): Promise<boolean> {
    if (!isAuthenticated()) {
      return false;
    }
    
    if (isTokenExpired()) {
      const refreshed = await refreshAccessToken();
      return refreshed;
    }
    
    return true;
  }
  
  /**
   * Creates headers with authentication token
   */
  static getAuthHeaders(): HeadersInit {
    const accessToken = getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  }
}

export default AuthService;
