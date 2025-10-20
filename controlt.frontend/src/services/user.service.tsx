import api from '../config/Axios';
import type { UserCreateRequest, UserUpdateRequest } from '../dtos/user/User.req.dto';
import type { UserCreateResponse, UserFindByIdResponse, UserListResponse, UserUpdateResponse } from '../dtos/user/User.res.dto';

export const userService = {
    async list(): Promise<Array<UserListResponse>> {
        const response = await api.get('/users');
        return response.data;
    },

    async findById(id: number): Promise<UserFindByIdResponse> {
        const response = await api.get('/users/' + id);
        return response.data;
    },

    async create(data: UserCreateRequest): Promise<UserCreateResponse> {
        const response = await api.post(`/users`, data);
        return response.data;
    },

    async update(data: UserUpdateRequest): Promise<UserUpdateResponse> {
        const response = await api.put(`/users/${data.id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    }
};