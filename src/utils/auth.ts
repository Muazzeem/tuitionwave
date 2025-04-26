
interface AuthTokens {
  access: string;
  refresh: string;
}

export const setAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
