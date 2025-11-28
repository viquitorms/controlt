import prisma from "../config/prisma.config.js";
import { Task, Prisma } from "@prisma/client";
import CreateTaskDto from "../dtos/task/createTask.dto.js";
import UpdateTaskDto from "../dtos/task/updateTask.dto.js";
import TaskFilterDto from "../dtos/task/filterTask.dto.js";
import recordedTimeService from "./recordedTime.service.js";
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
        const { ...whereClause } = filters;

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

    /**
     * Inicia a execução da tarefa (Start).
     * Registra o tempo e muda status para 'Em Andamento' (ID 2).
     */
    public async start(id: number, userId: number): Promise<Task> {
        const task = await this.findById(id);

        if (!userId) {
            throw new Error("Usuário não identificado.");
        }

        if (!task) {
            throw new Error("Tarefa não encontrada.");
        }

        if (task.assigned_to_id && task.assigned_to_id !== userId) {
            throw new Error("Somente o usuário atribuído pode iniciar esta tarefa.");
        }

        await recordedTimeService.start({ task_id: id }, userId);

        const statusInProgress = await prisma.statusTask.findFirstOrThrow({
            where: { name: "Em Andamento" }
        });

        return prisma.task.update({
            where: { id },
            data: {
                status: {
                    connect: {
                        id: statusInProgress.id,
                        name: statusInProgress.name
                    }
                },
                assigned_to: task.assigned_to_id ? undefined : { connect: { id: userId } },
                started_at: task.started_at ? undefined : new Date(),
            }
        });
    }

    /**
     * Pausa a execução de uma tarefa (Stop/Pause).
     * - Para o cronômetro atual.
     * - Pode manter o status ou mudar para 'Próxima Ação' novamente.
     */
    public async pause(id: number, userId: number): Promise<Task> {
        await this.findById(id);

        // Tenta parar o cronômetro deste usuário
        try {
            await recordedTimeService.stop(userId);
        } catch (error) { }

        return prisma.task.findUniqueOrThrow({ where: { id } });
    }

    /**
         * Conclui a tarefa (Finish).
         */
    public async finish(id: number, userId: number): Promise<Task> {
        const task = await this.findById(id);
        const now = new Date();
        const activeTime = await recordedTimeService.getActiveTimer(userId);
        const wasRunningThisTask = activeTime?.task_id === id;

        if (activeTime) {
            await recordedTimeService.stop(userId);
        }

        if (!task.started_at && !wasRunningThisTask) {
            await recordedTimeService.start({ task_id: id }, userId);
            await recordedTimeService.stop(userId);
        }

        const statusCompleted = await prisma.statusTask.findFirstOrThrow({
            where: { name: "Concluída" }
        });

        return prisma.task.update({
            where: { id },
            data: {
                status_id: statusCompleted.id,
                started_at: task.started_at ?? now,
                completed_at: now,
            }
        });
    }

    /**
     * Finaliza múltiplas tarefas de uma vez.
     * Útil para operações em lote.
     */
    public async finishMany(ids: number[], userId: number): Promise<Prisma.BatchPayload> {
        if (!ids || ids.length === 0) {
            throw new Error("Nenhuma tarefa fornecida para finalização.");
        }

        const now = new Date();

        const statusCompleted = await prisma.statusTask.findFirstOrThrow({
            where: { name: "Concluída" },
            select: { id: true }
        });

        const tasksNotStarted = await prisma.task.findMany({
            where: {
                id: { in: ids },
                started_at: null
            },
            select: { id: true }
        });

        if (tasksNotStarted.length > 0) {
            const unstartedIds = tasksNotStarted.map(t => t.id);

            await prisma.task.updateMany({
                where: { id: { in: unstartedIds } },
                data: { started_at: now }
            });

            for (const task of tasksNotStarted) {
                await recordedTimeService.start({ task_id: task.id }, userId);
                await recordedTimeService.stop(userId);
            }
        }

        return prisma.task.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                status_id: statusCompleted.id,
                completed_at: now
            }
        });
    }
}

export default new TaskService();