import type { Profile } from "../profile/profile.res.dto";

export interface User {
    id: number;
    name: string;
    email: string;
    profile: Profile;
    created_date: Date;
}