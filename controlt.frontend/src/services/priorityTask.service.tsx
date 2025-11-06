import api from "../config/Axios.tsx";
import type { CreatePriorityTaskDto } from "../dtos/priorityTask/priorityTask.req.dto.tsx";
import type { PriorityTask } from "../dtos/priorityTask/priorityTask.res.dto.tsx";

export const priorityTaskService = {
    async create(data: CreatePriorityTaskDto): Promise<PriorityTask> {
        const response = await api.post("/priority-tasks", data);
        return response.data as PriorityTask;
    },

    async findAll(): Promise<PriorityTask[]> {
        const response = await api.get("/priority-tasks");
        return response.data as PriorityTask[];
    },
};