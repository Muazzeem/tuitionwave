
// Utility function to detect URLs in text
export const detectUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

// Utility function to check if a string is a valid URL
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Utility function to extract domain from URL
export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return url;
  }
};
