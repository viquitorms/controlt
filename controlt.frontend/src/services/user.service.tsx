import api from "../config/Axios";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user/User.req.dto.tsx";
import type { User } from "../dtos/user/User.res.dto.tsx";

export const userService = {
    async create(data: CreateUserDto): Promise<User> {
        const response = await api.post("/users", data);
        return response.data as User;
    },

    async findAll(): Promise<User[]> {
        const response = await api.get("/users");
        return response.data as User[];
    },

    async findById(id: number): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data as User;
    },

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const response = await api.put(`/users/${id}`, data);
        return response.data as User;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    },
};