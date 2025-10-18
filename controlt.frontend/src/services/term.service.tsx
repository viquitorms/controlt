import api from '../config/Axios';
import type {
    TermCreateRequest,
    TermUpdateRequest,
    TermListFilters
} from '../dtos/term/Term.req.dto';
import type {
    TermListResponse,
    TermFindByIdResponse,
    TermFindByNameResponse,
    TermCreateResponse,
    TermUpdateResponse
} from '../dtos/term/Term.res.dto';

export const termService = {
    async list(filters?: TermListFilters): Promise<Array<TermListResponse>> {
        const params = new URLSearchParams();
        if (filters?.search) {
            params.append('search', filters.search);
        }

        const response = await api.get(`/terms?${params.toString()}`);
        return response.data;
    },

    async findById(id: number): Promise<TermFindByIdResponse> {
        const response = await api.get(`/terms/${id}`);
        return response.data;
    },

    async findByName(name: string): Promise<TermFindByNameResponse> {
        const response = await api.get(`/terms/search/${encodeURIComponent(name)}`);
        return response.data;
    },

    async create(data: TermCreateRequest): Promise<TermCreateResponse> {
        const response = await api.post('/terms', data);
        return response.data;
    },

    async update(data: TermUpdateRequest): Promise<TermUpdateResponse> {
        const response = await api.put(`/terms/${data.id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/terms/${id}`);
    }
};