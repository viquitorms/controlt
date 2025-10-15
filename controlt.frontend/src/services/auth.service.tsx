import api from '../config/Axios';
import type { LoginRequest, RegisterRequest } from '../dtos/auth/Auth.req.dto';
import type { LoginResponse, RegisterResponse } from '../dtos/auth/Auth.res.dto';

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post('/auth/login', data);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    },

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            profile_id: data.profile_id,
        });

        return response.data;
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
};