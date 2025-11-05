import api from "../config/Axios";
import type {
    CreateProjectDto,
    UpdateProjectDto,
    FilterProjectDto,
} from "../dtos/project/Project.req.dto";
import type { Project } from "../dtos/project/Project.res.dto";

export const projectService = {
    async create(data: CreateProjectDto): Promise<Project> {
        const response = await api.post("/projects", data);
        return response.data as Project;
    },

    async findAll(filters?: FilterProjectDto): Promise<Project[]> {
        const response = await api.get("/projects", {
            params: filters,
        });
        return response.data as Project[];
    },

    async findById(id: number): Promise<Project> {
        const response = await api.get(`/projects/${id}`);
        return response.data as Project;
    },

    async update(id: number, data: UpdateProjectDto): Promise<Project> {
        const response = await api.put(`/projects/${id}`, data);
        return response.data as Project;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/projects/${id}`);
    },
};