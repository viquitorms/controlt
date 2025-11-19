import prisma from "../config/prisma.config.js";
import { Task, Prisma } from "@prisma/client";
import CreateTaskDto from "../dtos/task/createTask.dto.js";
import UpdateTaskDto from "../dtos/task/updateTask.dto.js";
import TaskFilterDto from "../dtos/task/filterTask.dto.js";
import itemService from "./item.service.js";

class TaskService {
    /**
     * Cria uma nova tarefa.
     */
    public async create(data: CreateTaskDto): Promise<Task> {

        const newTask = prisma.task.create({
            data: {
                ...data,
                item_id: Number(data.item_id),
                status_id: Number(data.status_id),
                created_by_id: Number(data.created_by_id),
                priority_id: data.priority_id ? Number(data.priority_id) : undefined,
                project_id: data.project_id ? Number(data.project_id) : undefined,
                assigned_to_id: data.assigned_to_id ? Number(data.assigned_to_id) : undefined,
            },
        });

        if (!newTask) {
            throw new Error(`Erro ao criar a tarefa ${data.title}.`);
        }

        const item = await itemService.update(data.item_id, { is_processed: true });

        if (!item) {
            throw new Error(`Erro ao atualizar o item associado à tarefa ${data.title}.`);
        }

        return newTask;
    }

    /**
     * Lista tarefas com filtros.
     */
    public async findAll(filters: TaskFilterDto): Promise<Task[]> {
        const { page = 1, limit = 20, ...whereClause } = filters;

        const where: Prisma.TaskWhereInput = {
            ...whereClause,
            ...(whereClause.status_id && { status_id: Number(whereClause.status_id) }),
            ...(whereClause.priority_id && { priority_id: Number(whereClause.priority_id) }),
            ...(whereClause.project_id && { project_id: Number(whereClause.project_id) }),
            ...(whereClause.assigned_to_id && { assigned_to_id: Number(whereClause.assigned_to_id) }),
            ...(whereClause.due_date_from && { due_date: { gte: new Date(whereClause.due_date_from) } }),
            ...(whereClause.due_date_to && { due_date: { lte: new Date(whereClause.due_date_to) } })
        };

        return prisma.task.findMany({
            where,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            include: {
                status: true,
                priority: true,
                assigned_to: true,
                created_by: true,
                project: true,
                item: true,
            },
            orderBy: { created_date: "desc" },
        });
    }

    /**
     * Busca uma tarefa por ID.
     */
    public async findById(id: number): Promise<Task> {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) throw new Error("Tarefa não encontrada.");
        return task;
    }

    /**
     * Atualiza uma tarefa.
     */
    public async update(id: number, data: UpdateTaskDto): Promise<Task> {
        await this.findById(id);
        return prisma.task.update({
            where: { id },
            data: data,
        });
    }

    /**
     * Deleta uma tarefa.
     */
    public async delete(id: number): Promise<void> {
        const task = await this.findById(id);

        if (!task) {
            throw new Error("Tarefa não encontrada.");
        }

        await prisma.task.delete({ where: { id } });
    }
}

export default new TaskService();