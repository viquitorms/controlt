import prisma from '../config/prisma.config.js'
import { Prisma, RecordedTime } from '@prisma/client';
import StartTimerDto from '../dtos/recordedTime/startTimer.dto.js';
import FilterRecordedTimeDto from '../dtos/recordedTime/filterRecordedTime.dto.js';

class RecordedTimeService {

    /**
     * Inicia um novo cronômetro para o usuário especificado.
     * @param data 
     * @param userId 
     * @returns 
     */
    public async start(data: StartTimerDto, userId: number): Promise<RecordedTime> {
        const { task_id } = data;

        if (!task_id) {
            throw new Error('Tarefa não especificada para iniciar o cronômetro.');
        }

        const activeTime = await this.getActiveTimer(userId);
        if (activeTime) {
            throw new Error('Já existe um tempo registrado ativo para este usuário. Pare o atual antes de iniciar um novo.');
        }

        return prisma.recordedTime.create({
            data: {
                startedAt: new Date(),
                endedAt: null,
                user_id: userId,
                task_id: task_id
            }
        });
    }

    /**
     * Para um cronômetro ativo para o usuário especificado.
     * @param user_id 
     * @returns 
     */
    public async stop(user_id: number): Promise<RecordedTime> {
        const activeTime = await this.getActiveTimer(user_id);
        if (!activeTime) {
            throw new Error('Não há tempo registrado ativo para este usuário.');
        }
        return prisma.recordedTime.update({
            where: { id: activeTime.id },
            data: { endedAt: new Date() }
        });
    }

    /**
     * Busca todos os tempos registrados com base nos filtros fornecidos.
     * @param filters 
     */
    public async findAll(filters: FilterRecordedTimeDto): Promise<RecordedTime[]> {
        const { page = 1, limit = 20, date_from, date_to, ...rest } = filters;

        const where: Prisma.RecordedTimeWhereInput = { ...rest };

        if (date_from) {
            const prev = (where.startedAt as Prisma.DateTimeFilter) ?? {};
            where.startedAt = { ...prev, gte: new Date(date_from) };
        }
        if (date_to) {
            const prev = (where.startedAt as Prisma.DateTimeFilter) ?? {};
            where.startedAt = { ...prev, lte: new Date(date_to) };
        }

        return prisma.recordedTime.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { startedAt: 'desc' },
        });
    }

    public async getActiveTimer(user_id: number): Promise<RecordedTime | null> {
        return prisma.recordedTime.findFirst({
            where: {
                user_id: user_id,
                endedAt: null,
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
    }

    public async delete(id: number, user_id: number): Promise<void> {
        const record = await prisma.recordedTime.findUnique({
            where: { id }
        });

        if (!record) {
            throw new Error('Registro de tempo não encontrado.');
        }

        if (record.user_id !== user_id) {
            throw new Error('Você não tem permissão para deletar este registro de tempo.');
        }

        await prisma.recordedTime.delete({
            where: { id }
        });
    }
}

export default new RecordedTimeService();