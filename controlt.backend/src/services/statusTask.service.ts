import { StatusTask } from "@prisma/client";
import prisma from "../config/prisma.config.js";
import CreateStatusTaskDto from "../dtos/statusTask/createStatusTask.dto.js";

class StatusTaskService {

    /**
     * Cria um status de tarefa.
     * @param data 
     * @returns 
     */
    public async create(data: CreateStatusTaskDto): Promise<StatusTask> {
        const { name } = data;
        const status = await prisma.statusTask.findUnique({ where: { name } });
        if (status) {
            throw new Error(`O status '${name}' já existe.`);
        }
        return await prisma.statusTask.create({ data });
    }

    /**
     * Retorna todos os status de tarefa.
     * @returns 
     */
    public async findAll(): Promise<StatusTask[]> {
        return prisma.statusTask.findMany({
            orderBy: { id: 'asc' }
        });
    }
}

export default new StatusTaskService();