import prisma from "../config/prisma.config.js";
import { Prisma } from "@prisma/client";

class MetricService {
    /**
     * Calcula o Lead Time das tarefas concluídas.
     * Lead Time = Data de Conclusão (Task) - Data de Captura (Item)
     */
    public async getLeadTime(userId: number, filters?: any) {
        const { project_id, date_from, date_to } = filters || {};

        const statusCompleted = await prisma.statusTask.findFirstOrThrow({
            where: { name: "Concluída" }
        });

        const where: Prisma.TaskWhereInput = {
            status_id: statusCompleted.id,
            created_by_id: userId,
            completed_at: { not: null },
            ...(project_id && { project_id: Number(project_id) }),
            ...(date_from && { completed_at: { gte: new Date(date_from) } }),
            ...(date_to && { completed_at: { lte: new Date(date_to) } }),
        };

        const tasks = await prisma.task.findMany({
            where,
            include: {
                item: {
                    select: { created_date: true }
                },
                project: {
                    select: { title: true }
                }
            },
            orderBy: { completed_at: 'desc' }
        });

        // Realiza o cálculo para cada tarefa
        const tasksWithMetrics = tasks.map(task => {
            if (!task.completed_at || !task.item?.created_date) return null;

            const completionDate = new Date(task.completed_at);
            const captureDate = new Date(task.item.created_date);
            const diffTime = Math.abs(completionDate.getTime() - captureDate.getTime());
            const leadTimeDays = parseFloat((diffTime / (1000 * 60 * 60 * 24)).toFixed(1));

            return {
                id: task.id,
                title: task.title,
                project: task.project?.title || 'Sem Projeto',
                capture_date: captureDate,
                completion_date: completionDate,
                lead_time_days: leadTimeDays
            };
        }).filter(item => item !== null);

        // Calcula a média
        const totalLeadTime = tasksWithMetrics.reduce((acc, curr) => acc + (curr?.lead_time_days || 0), 0);
        const averageLeadTime = tasksWithMetrics.length > 0
            ? parseFloat((totalLeadTime / tasksWithMetrics.length).toFixed(1))
            : 0;

        return {
            metric: "Lead Time (Dias)",
            description: "Tempo decorrido entre a Captura (Inbox) e a Conclusão da tarefa.",
            summary: {
                average: averageLeadTime,
                total_tasks: tasksWithMetrics.length
            },
            data: tasksWithMetrics
        };
    }

    /**
     * Calcula a Taxa de Conclusão Planeada (Planned Conclusion Rate).
     * Fórmula: (Tarefas Concluídas do Plano / Total Tarefas Planeadas) * 100%
     * Considera "Planeadas" todas as tarefas com due_date no período.
     */
    public async getConclusionRate(userId: number, filters?: any) {
        const { project_id, date_from, date_to } = filters || {};

        const statusCompleted = await prisma.statusTask.findFirstOrThrow({
            where: { name: "Concluída" }
        });

        const wherePlanned: Prisma.TaskWhereInput = {
            due_date: { not: null },
            ...(project_id && { project_id: Number(project_id) }),
            ...(date_from && { due_date: { gte: new Date(date_from) } }),
            ...(date_to && { due_date: { lte: new Date(date_to) } }),
        };

        const plannedTasks = await prisma.task.findMany({
            where: wherePlanned,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                due_date: true,
                completed_at: true,
                project: true,
                priority: true,
                assigned_to: true,
                created_date: true,
                created_by: true,
                recorded_time: {
                    select: {
                        id: true,
                        startedAt: true,
                        endedAt: true,
                        user: true,
                    }
                },
            },
            orderBy: { due_date: 'asc' }
        });

        const totalPlanned = plannedTasks.length;
        const completedTasks = plannedTasks.filter(t => t.status.id === statusCompleted.id);
        const totalCompleted = completedTasks.length;

        // Taxa de conclusão em porcentagem
        const rate = totalPlanned > 0 ? parseFloat(((totalCompleted / totalPlanned) * 100).toFixed(1)) : 0;

        return {
            summary: {
                rate: rate,
                total_planned: totalPlanned,
                total_completed: totalCompleted
            },
            data: plannedTasks
        };
    }
}

export default new MetricService();