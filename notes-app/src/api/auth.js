import axios from 'axios';

const API_URL = process.env.REACT_APP_SSO_SERVER_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const verifyFirebaseToken = async (idToken) => {
  const response = await api.post('/api/auth/verify-token', { idToken });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  localStorage.removeItem('accessToken');
  return response.data;
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check');
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};