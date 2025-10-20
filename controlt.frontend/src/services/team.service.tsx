import api from '../config/Axios';
import type { TeamCreateRequest, TeamUpdateRequest, TeamAddMemberRequest, TeamRemoveMemberRequest } from '../dtos/team/Team.req.dto';
import type {
    TeamListResponse,
    TeamFindByIdResponse,
    TeamCreateResponse,
    TeamUpdateResponse,
    TeamGetMembersResponse,
    TeamAddMemberResponse,
    TeamRemoveMemberResponse
} from '../dtos/team/Team.res.dto';

export const teamService = {
    async list(): Promise<Array<TeamListResponse>> {
        const response = await api.get('/teams');
        return response.data;
    },

    async findById(id: number): Promise<TeamFindByIdResponse> {
        const response = await api.get('/teams/' + id);
        return response.data;
    },

    async create(data: TeamCreateRequest): Promise<TeamCreateResponse> {
        const response = await api.post('/teams', data);
        return response.data;
    },

    async update(data: TeamUpdateRequest): Promise<TeamUpdateResponse> {
        const response = await api.put(`/teams/${data.id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/teams/${id}`);
    },

    async getMembers(teamId: number): Promise<Array<TeamGetMembersResponse>> {
        const response = await api.get(`/teams/${teamId}/members`);
        return response.data;
    },

    async addMember(data: TeamAddMemberRequest): Promise<TeamAddMemberResponse> {
        const response = await api.post(`/teams/${data.team_id}/members`, { user_id: data.user_id });
        return response.data;
    },

    async removeMember(data: TeamRemoveMemberRequest): Promise<TeamRemoveMemberResponse> {
        const response = await api.delete(`/teams/${data.team_id}/members/${data.user_id}`);
        return response.data;
    }
};