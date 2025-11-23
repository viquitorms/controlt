import api from "../config/Axios";
import type {
    CreateTaskDto,
    UpdateTaskDto,
    TaskFilterDto,
} from "../dtos/task/task.req.dto.tsx";
import type { Task } from "../dtos/task/task.res.dto.tsx";

export const taskService = {
    async create(data: CreateTaskDto): Promise<Task> {
        const response = await api.post("/tasks", data);
        return response.data as Task;
    },

    async findAll(filters?: TaskFilterDto): Promise<Task[]> {
        const response = await api.get("/tasks", { params: filters });
        return response.data as Task[];
    },

    async findById(id: number): Promise<Task> {
        const response = await api.get(`/tasks/${id}`);
        return response.data as Task;
    },

    async update(id: number, data: UpdateTaskDto): Promise<Task> {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data as Task;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    async start(id: number): Promise<Task> {
        const response = await api.patch(`/tasks/${id}/start`);
        return response.data as Task;
    },

    async pause(id: number): Promise<Task> {
        const response = await api.patch(`/tasks/${id}/pause`);
        return response.data as Task;
    },

    async finish(id: number): Promise<Task> {
        const response = await api.patch(`/tasks/${id}/finish`);
        return response.data as Task;
    },

    async finishMany(ids: number[]): Promise<Task> {
        const response = await api.patch(`/tasks/finish-many`, { ids });
        return response.data as Task;
    },
};