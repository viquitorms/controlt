import { PriorityTask } from "@prisma/client";
import CreatePriorityTaskDto from "../dtos/priorityTask/createPriorityTask.dto.js";
import prisma from "../config/prisma.config.js"

class PriorityTaskService {

    /**
     * Cria uma nova prioridade de tarefa.
     * @param data 
     * @returns 
     */
    public async create(data: CreatePriorityTaskDto): Promise<PriorityTask> {
        const { level, name } = data;

        const isLevelExisting = await prisma.priorityTask.findUnique({
            where: { level }
        });

        if (isLevelExisting) {
            throw new Error(`O nível de prioridade ${level} já existe.`);
        }

        return await prisma.priorityTask.create({
            data: {
                level,
                name
            }
        });
    }

    /**
     * Busca todas as prioridades de tarefas.
     * @returns 
     */
    public async findAll(): Promise<PriorityTask[]> {
        return await prisma.priorityTask.findMany({
            orderBy: {
                level: 'asc'
            }
        });
    }
}

export default new PriorityTaskService();