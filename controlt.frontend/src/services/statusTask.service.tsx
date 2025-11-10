import api from "../config/Axios";
import type { CreateStatusTaskDto } from "../dtos/statusTask/statusTask.req.dto.tsx";
import type { StatusTask } from "../dtos/statusTask/statusTask.res.dto.tsx";

export const statusTaskService = {
    async create(data: CreateStatusTaskDto): Promise<StatusTask> {
        const response = await api.post("/status-tasks", data);
        return response.data as StatusTask;
    },

    async findAll(): Promise<StatusTask[]> {
        const response = await api.get("/status-tasks");
        return response.data as StatusTask[];
    },
};