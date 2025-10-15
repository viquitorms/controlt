import type { Profile } from "../Profile.entity"

export interface LoginResponse {
    token: string,
    id: number,
    name: string,
    email: string,
    profile: Profile
}

export interface RegisterResponse {
    id: number,
    name: string,
    email: string,
    profile_id: number,
    created_date: Date
    profile?: Profile
}