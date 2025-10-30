import { ProfileResponse } from "./profile.type";

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    profile: ProfileResponse;
    created_date: Date;
}