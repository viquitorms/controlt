import prisma from '../config/prisma.config.js';

class RecordedTimeService {

    /**
     * Registra tempo em um item
     * @param {Object} data - Dados do registro
     * @returns {Promise<Object>} Registro criado
     */
    async create(data) {
        const { item_id, user_id, minutes_duration } = data;

        if (!item_id || !user_id || !minutes_duration) {
            throw new Error('item_id, user_id e minutes_duration são obrigatórios');
        }

        if (minutes_duration <= 0) {
            throw new Error('Duração dos minutos deve ser maior que 0');
        }

        const itemExists = await prisma.item.findUnique({
            where: { id: item_id }
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        const userExists = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!userExists) {
            throw new Error('Usuário não encontrado');
        }

        return await prisma.recordedTime.create({
            data: {
                item_id,
                user_id,
                minutes_duration
            },
            include: {
                item: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Lista todos os registros de tempo
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Array>} Lista de registros
     */
    async list(filters = {}) {
        const { user_id, item_id, start_date, end_date } = filters;

        return await prisma.recordedTime.findMany({
            where: {
                ...(user_id && { user_id: Number(user_id) }),
                ...(item_id && { item_id: Number(item_id) }),
                ...(start_date && end_date && {
                    register_date: {
                        gte: new Date(start_date),
                        lte: new Date(end_date)
                    }
                })
            },
            include: {
                item: {
                    select: {
                        id: true,
                        title: true,
                        project: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    /**
     * Busca registro por ID
     * @param {number} id - ID do registro
     * @returns {Promise<Object>} Registro encontrado
     */
    async findById(id) {
        const record = await prisma.recordedTime.findUnique({
            where: { id },
            include: {
                item: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!record) {
            throw new Error('Record not found');
        }

        return record;
    }

    /**
     * Atualiza um registro de tempo
     * @param {number} id - ID do registro
     * @param {Object} data - Dados para atualizar
     * @returns {Promise<Object>} Registro atualizado
     */
    async update(id, data) {
        const recordExists = await prisma.recordedTime.findUnique({
            where: { id }
        });

        if (!recordExists) {
            throw new Error('Registro não encontrado');
        }

        const { minutes_duration } = data;

        if (minutes_duration && minutes_duration <= 0) {
            throw new Error('Duração em minutos deve ser maior que 0');
        }

        return await prisma.recordedTime.update({
            where: { id },
            data: {
                ...(minutes_duration && { minutes_duration })
            },
            include: {
                item: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Deleta um registro de tempo
     * @param {number} id - ID do registro
     */
    async delete(id) {
        const recordExists = await prisma.recordedTime.findUnique({
            where: { id }
        });

        if (!recordExists) {
            throw new Error('Registro não encontrado');
        }

        await prisma.recordedTime.delete({
            where: { id }
        });
    }

    /**
     * Busca tempo total por item
     * @param {number} itemId - ID do item
     * @returns {Promise<Object>} Dados agregados
     */
    async getTimeByItem(itemId) {
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        if (!item) {
            throw new Error('Item não encontrado');
        }

        const records = await prisma.recordedTime.findMany({
            where: { item_id: itemId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const totalMinutes = records.reduce((sum, record) => sum + record.minutes_duration, 0);

        return {
            item_id: item.id,
            item_title: item.title,
            item_description: item.description,
            project: item.project,
            total_minutes: totalMinutes,
            total_hours: (totalMinutes / 60).toFixed(2),
            records_count: records.length,
            records: records
        };
    }

    /**
     * Busca tempo total por usuário
     * @param {number} userId - ID do usuário
     * @param {Object} filters - Filtros de data
     * @returns {Promise<Object>} Dados agregados
     */
    async getTimeByUser(userId, filters = {}) {
        const { start_date, end_date } = filters;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        if (!user) {
            throw new Error('Ususário não encontrado');
        }

        const records = await prisma.recordedTime.findMany({
            where: {
                user_id: userId,
                ...(start_date && end_date && {
                    register_date: {
                        gte: new Date(start_date),
                        lte: new Date(end_date)
                    }
                })
            },
            include: {
                item: {
                    select: {
                        id: true,
                        title: true,
                        project: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });

        const totalMinutes = records.reduce((sum, record) => sum + record.minutes_duration, 0);

        const itemsBreakdown = records.reduce((acc, record) => {
            const itemId = record.item.id;
            if (!acc[itemId]) {
                acc[itemId] = {
                    item_id: record.item.id,
                    item_title: record.item.title,
                    project: record.item.project,
                    total_minutes: 0,
                    records_count: 0
                };
            }
            acc[itemId].total_minutes += record.minutes_duration;
            acc[itemId].records_count += 1;
            return acc;
        }, {});

        return {
            user,
            total_minutes: totalMinutes,
            total_hours: (totalMinutes / 60).toFixed(2),
            records_count: records.length,
            items_breakdown: Object.values(itemsBreakdown)
        };
    }

    /**
     * Busca tempo total por projeto
     * @param {number} projectId - ID do projeto
     * @returns {Promise<Object>} Dados agregados
     */
    async getTimeByProject(projectId) {
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        // Buscar todos os items do projeto
        const items = await prisma.item.findMany({
            where: { project_id: projectId },
            include: {
                recorded_time: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        let totalMinutes = 0;
        const itemsBreakdown = items.map(item => {
            const itemMinutes = item.recorded_time.reduce((sum, record) => sum + record.minutes_duration, 0);
            totalMinutes += itemMinutes;

            return {
                item_id: item.id,
                item_title: item.title,
                total_minutes: itemMinutes,
                total_hours: (itemMinutes / 60).toFixed(2),
                records_count: item.recorded_time.length
            };
        });

        return {
            project_id: project.id,
            project_title: project.title,
            project_description: project.description,
            total_minutes: totalMinutes,
            total_hours: (totalMinutes / 60).toFixed(2),
            items_count: items.length,
            items_breakdown: itemsBreakdown
        };
    }
}

export default new RecordedTimeService();