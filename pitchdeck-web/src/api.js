import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pitchdeck_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            error.message = 'Unable to connect to the server. Please check if the API is running.';
        }
        return Promise.reject(error);
    }
);

export default api;
