export interface TeamCreateRequest {
    name: string;
}

export interface TeamUpdateRequest {
    id: number;
    name?: string;
}

export interface TeamAddMemberRequest {
    team_id: number;
    user_id: number;
}

export interface TeamRemoveMemberRequest {
    team_id: number;
    user_id: number;
}