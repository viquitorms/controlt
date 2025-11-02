import prisma from "../config/prisma.config.js";
import { StatusProject } from "@prisma/client";
import CreateStatusProjectDto from "../dtos/statusProject/createStatusProject.dto.js";

class StatusProjectService {
    /**
     * Cria um novo status de projeto.
     */
    public async create(data: CreateStatusProjectDto): Promise<StatusProject> {
        const { name } = data;
        const existingStatus = await prisma.statusProject.findUnique({ where: { name } });
        if (existingStatus) {
            throw new Error(`O status '${name}' já existe.`);
        }
        return prisma.statusProject.create({ data: { name } });
    }

    /**
     * Lista todos os status de projeto.
     */
    public async findAll(): Promise<StatusProject[]> {
        return prisma.statusProject.findMany({
            orderBy: { id: 'asc' }
        });
    }
}

export default new StatusProjectService();