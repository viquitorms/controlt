import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://controlt.onrender.com/api'
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Trata respostas e erros
api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const isAuthRoute = error.config?.url?.includes('/auth/');

        if (status === 401 && !isAuthRoute) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(new Error('Sessão expirada'));
        }

        return Promise.reject(error);
    }
);

export default api;