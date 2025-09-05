
interface AuthTokens {
  access: string;
  refresh: string;
}

export const setAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  localStorage.setItem('tokenExpiry', String(Date.now() + 1000 * 60 * 14)); // 14 minutes expiry (assuming 15 min JWT)
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const getTokenExpiry = (): number => {
  const expiry = localStorage.getItem('tokenExpiry');
  return expiry ? parseInt(expiry, 10) : 0;
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  // If current time is past expiry time (with 10 second buffer)
  return Date.now() > expiry - 10000;
};

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      localStorage.clear();
      sessionStorage.clear();
      return false;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('tokenExpiry', String(Date.now() + 1000 * 60 * 14));

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);

    // Clear all storage on error
    localStorage.clear();
    sessionStorage.clear();

    return false;
  }
};

