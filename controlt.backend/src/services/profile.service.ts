import { Profile } from "@prisma/client";
import prisma from "../config/prisma.config.js";

class ProfileService {

    /**
     * Lista todos os usuários
     * @returns 
     */
    async list(): Promise<Profile[]> {
        return await prisma.profile.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }
}

export default new ProfileService();