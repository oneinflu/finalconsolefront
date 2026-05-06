export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal = 
      hostname === "localhost" || 
      hostname === "127.0.0.1" || 
      hostname.includes(".local") || 
      /^192\.168\./.test(hostname) || 
      /^10\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);

    if (isLocal) {
      return "http://localhost:3000";
    }
  }
  return "https://consoleapis-qqtlx.ondigitalocean.app";
};

export const API_BASE_URL = getBaseUrl();
