import type { Profile } from "./Profile.entity"

export interface User {
    id: number,
    name: string,
    email?: string,
    password: string,
    profile_id: number,
    created_date: Date

    profile?: Profile
}