import axios from 'axios';
import { TOKEN_KEY } from '../services/auth.services';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 35000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach JWT token to every outgoing request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
