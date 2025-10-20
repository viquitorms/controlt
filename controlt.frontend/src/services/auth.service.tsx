import api from '../config/Axios';
import type { LoginRequest } from '../dtos/auth/Auth.req.dto';
import type { LoginResponse } from '../dtos/auth/Auth.res.dto';
import { ProfileEnum } from '../enums/Profile.enum';
import { Crypto } from '../utils/Crypto.util';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        name: string;
    };
}

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post('/auth/login', data);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);

            const user: AuthUser = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                profile: response.data.user.profile
            };

            const userEncrypted = Crypto.encryptData(JSON.stringify(user));
            localStorage.setItem('user', userEncrypted);
        }

        return response.data;
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser(): AuthUser | null {
        try {
            const userEncrypted = localStorage.getItem('user');

            if (!userEncrypted) {
                return null;
            }

            const userDecrypted = Crypto.decryptData(userEncrypted);
            const user: AuthUser = JSON.parse(userDecrypted);

            return user;
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    },

    hasManagerPermission(): boolean {
        try {
            const user = this.getCurrentUser();

            if (!user) {
                return false;
            }
            if (user.profile.id == ProfileEnum.GERENTE) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
};