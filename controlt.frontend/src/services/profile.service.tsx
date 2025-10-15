import api from '../config/Axios';
import type { Profile } from '../dtos/Profile.entity';

export const profileService = {
    async getList(): Promise<Array<Profile> & { token: string }> {
        const response = await api.get('/profiles');
        return response.data;
    },
};