import api from "../config/Axios";
import type { Profile } from "../dtos/profile/profile.res.dto.tsx";

export const profileService = {
    async list(): Promise<Profile[]> {
        const response = await api.get("/profiles");
        return response.data as Profile[];
    },
};