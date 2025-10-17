import api from '../config/Axios';
import type { ProjectCreateRequest, ProjectUpdateRequest } from '../dtos/project/Project.req.dto';
import type { ProjectCreateResponse, ProjectFindByIdResponse, ProjectListResponse, ProjectUpdateResponse } from '../dtos/project/Project.res.dto';

export const projectService = {
    async list(): Promise<Array<ProjectListResponse>> {
        const response = await api.get('/projects');
        return response.data;
    },

    async findById(id: number): Promise<ProjectFindByIdResponse> {
        const response = await api.get('/projects/' + id);
        return response.data;
    },

    async create(data: ProjectCreateRequest): Promise<ProjectCreateResponse> {
        const response = await api.post(`/projects`, data);
        return response.data;
    },

    async update(data: ProjectUpdateRequest): Promise<ProjectUpdateResponse> {
        const response = await api.put(`/projects/${data.id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/projects/${id}`);
    }
};