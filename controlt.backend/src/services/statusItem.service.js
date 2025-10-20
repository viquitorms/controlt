import prisma from "../config/prisma.config.js";

class StatusItemService {

    /**
     * Lista todos os usuários
     * @returns 
     */
    async list() {
        return await prisma.statusItem.findMany({
            select: {
                id: true,
                name: true,
                color: true,
            }
        })
    }
}

export default new StatusItemService();