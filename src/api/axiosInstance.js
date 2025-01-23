import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
