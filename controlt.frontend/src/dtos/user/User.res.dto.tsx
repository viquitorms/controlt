import type { Profile } from "../Profile.entity"

export interface UserListResponse {
    id: number;
    name: string;
    email: string;
    profile_id: number;
    created_date: Date;
    profile?: Profile;
}

export interface UserFindByIdResponse {
    id: number;
    name: string;
    email: string;
    password: string;
    profile_id: number;
    created_date: Date;
    profile?: Profile;
}

export interface UserCreateResponse {
    id: number,
    name: string,
    email: string,
    profile: Profile,
    created_date: Date
}

export interface UserUpdateResponse {
    id: number,
    name: string,
    email: string,
    profile: Profile
}