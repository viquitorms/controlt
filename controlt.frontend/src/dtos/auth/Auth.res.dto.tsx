import type { Profile } from "../Profile.entity"

export interface LoginResponse {
    token: string,
    id: number,
    name: string,
    email: string,
    profile: Profile
}