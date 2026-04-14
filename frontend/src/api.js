import axios from 'axios';

// 1. Create the Axios instance pointing to your FastAPI server
const api = axios.create({
  baseURL: 'http://localhost:8000', // Make sure this matches your FastAPI port!
});

// 2. Add an Interceptor to automatically attach the security token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;