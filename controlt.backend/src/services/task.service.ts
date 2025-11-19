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

    /**
     * Inicia a execução da tarefa (Start).
     * Registra o tempo e muda status para 'Em Andamento' (ID 2).
     */
    public async start(id: number, userId: number): Promise<Task> {
        const task = await this.findById(id);

        // Tenta iniciar o cronômetro. O service de recordedTime já valida se há outro ativo.
        // Se falhar (ex: usuário já tem timer rodando), o erro sobe e o controller trata.
        await recordedTimeService.start({ task_id: id }, userId);

        return prisma.task.update({
            where: { id },
            data: {
                status_id: 2, // Assumindo ID 2 = Em Andamento (Verifique seu Seed/Banco)
                // Grava started_at apenas se ainda não tiver sido iniciado antes
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
        } catch (error) {
            // Se não houver timer ativo, apenas ignoramos e seguimos para atualizar a task se necessário
            // (Neste caso, o pause pode ser chamado mesmo sem timer, por segurança)
        }

        // Aqui você decide: ao pausar, volta para "Próxima Ação" ou mantém "Em Andamento"?
        // Por enquanto, vamos manter o status visual, apenas parando a contagem de tempo.
        return prisma.task.findUniqueOrThrow({ where: { id } });
    }

    /**
     * Conclui a tarefa (Finish).
     * - Para o cronômetro.
     * - Define completed_at.
     * - Atualiza status para 'Concluída'.
     */
    public async finish(id: number, userId: number): Promise<Task> {
        await this.findById(id);

        // Para qualquer timer ativo do usuário ao concluir
        try {
            await recordedTimeService.stop(userId);
        } catch (error) {
            // Ignora erro de "nenhum timer ativo"
        }

        return prisma.task.update({
            where: { id },
            data: {
                status_id: 3, // Assumindo ID 3 = Concluída (Verifique seu Seed/Banco)
                completed_at: new Date(),
            }
        });
    }
}

export default new TaskService();