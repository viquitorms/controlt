import api from '../config/Axios';
import type { UserFindByIdResponse, UserListResponse } from '../dtos/user/User.res.dto';

export const userService = {
    async list(): Promise<Array<UserListResponse>> {
        const response = await api.get('/users');
        return response.data;
    },

    async findById(id: number): Promise<UserFindByIdResponse> {
        const response = await api.get('/users/' + id);
        return response.data;
    },

};