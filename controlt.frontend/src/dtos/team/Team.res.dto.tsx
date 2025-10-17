export interface TeamListResponse {
    id: number;
    name: string;
    created_date: Date;
}

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        name: string;
    };
}

export interface TeamFindByIdResponse {
    id: number;
    name: string;
    created_date: Date;
    members: TeamMember[];
}

export interface TeamCreateResponse {
    id: number;
    name: string;
    created_date: Date;
}

export interface TeamUpdateResponse {
    id: number;
    name: string;
    created_date: Date;
}

export interface TeamGetMembersResponse extends TeamMember { }

export interface TeamAddMemberResponse {
    message: string;
    team_id: number;
    user_id: number;
}

export interface TeamRemoveMemberResponse {
    message: string;
}