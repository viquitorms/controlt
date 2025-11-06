import api from "../config/Axios";
import type { CreateStatusProjectDto } from "../dtos/statusProject/statusProject.req.dto.tsx";
import type { StatusProject } from "../dtos/statusProject/statusProject.res.dto.tsx";

export const statusProjectService = {
    async create(data: CreateStatusProjectDto): Promise<StatusProject> {
        const response = await api.post("/status-projects", data);
        return response.data as StatusProject;
    },

    async findAll(): Promise<StatusProject[]> {
        const response = await api.get("/status-projects");
        return response.data as StatusProject[];
    },
};