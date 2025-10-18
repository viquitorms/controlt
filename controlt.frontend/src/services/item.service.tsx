import api from '../config/Axios';
import type {
    ItemCreateRequest,
    ItemUpdateRequest,
    ItemListFilters,
    ItemProcessRequest,
    ItemUpdateStatusRequest,
    ItemConvertToProjectRequest
} from '../dtos/item/Item.req.dto';
import type {
    ItemCreateResponse,
    ItemListResponse,
    ItemFindByIdResponse,
    ItemUpdateResponse,
    ItemInboxResponse,
    ItemProcessResponse,
    ItemUpdateStatusResponse,
    ItemCompleteResponse,
    ItemNextActionsResponse,
    ItemWaitingForResponse,
    ItemScheduledResponse,
    ItemSomedayMaybeResponse,
    ItemByUserResponse,
    ItemByProjectResponse,
    ItemConvertToProjectResponse
} from '../dtos/item/Item.res.dto';

export const itemService = {
    async create(data: ItemCreateRequest): Promise<ItemCreateResponse> {
        const response = await api.post('/items', data);
        return response.data;
    },

    async list(filters?: ItemListFilters): Promise<Array<ItemListResponse>> {
        const params = new URLSearchParams();
        if (filters?.user_id) params.append('user_id', filters.user_id.toString());
        if (filters?.project_id) params.append('project_id', filters.project_id.toString());
        if (filters?.status_name) params.append('status', filters.status_name);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get(`/items?${params.toString()}`);
        return response.data;
    },

    async findById(id: number): Promise<ItemFindByIdResponse> {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    async update(data: ItemUpdateRequest): Promise<ItemUpdateResponse> {
        const response = await api.put(`/items/${data.id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/items/${id}`);
    },

    async getInbox(userId: number): Promise<ItemInboxResponse> {
        const response = await api.get(`/items/inbox/${userId}`);
        return response.data;
    },

    async getNextActions(userId: number): Promise<ItemNextActionsResponse> {
        const response = await api.get(`/items/next-actions/${userId}`);
        return response.data;
    },

    async getWaitingFor(userId: number): Promise<ItemWaitingForResponse> {
        const response = await api.get(`/items/waiting/${userId}`);
        return response.data;
    },

    async getScheduled(userId: number): Promise<ItemScheduledResponse> {
        const response = await api.get(`/items/scheduled/${userId}`);
        return response.data;
    },

    async getSomedayMaybe(userId: number): Promise<ItemSomedayMaybeResponse> {
        const response = await api.get(`/items/someday/${userId}`);
        return response.data;
    },

    async processItem(data: ItemProcessRequest): Promise<ItemProcessResponse> {
        const { id, ...processData } = data;
        const response = await api.put(`/items/${id}/process`, processData);
        return response.data;
    },

    async updateStatus(data: ItemUpdateStatusRequest): Promise<ItemUpdateStatusResponse> {
        const response = await api.put(`/items/${data.id}/status`, { status: data.status_name });
        return response.data;
    },

    async completeItem(id: number): Promise<ItemCompleteResponse> {
        const response = await api.put(`/items/${id}/complete`);
        return response.data;
    },

    async convertToProject(data: ItemConvertToProjectRequest): Promise<ItemConvertToProjectResponse> {
        const { id, ...projectData } = data;
        const response = await api.post(`/items/${id}/convert-to-project`, projectData);
        return response.data;
    },

    async getByUser(userId: number): Promise<Array<ItemByUserResponse>> {
        const response = await api.get(`/items/user/${userId}`);
        return response.data;
    },

    async getByProject(projectId: number): Promise<Array<ItemByProjectResponse>> {
        const response = await api.get(`/items/project/${projectId}`);
        return response.data;
    }
};