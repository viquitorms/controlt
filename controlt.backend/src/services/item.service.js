// services/item.service.js
import prisma from '../config/prisma.config.js';

class ItemService {
    /**
     * Cria um novo item (captura na inbox)
     * @param {Object} data - Dados do item
     * @returns {Promise<Object>} Item criado
     */
    async create(data) {
        const { title, description, user_id, userAssigned_id, project_id, due_date, status_name } = data;

        if (!title) {
            throw new Error('O título é obrigatório');
        }

        if (userAssigned_id) {
            const userExists = await prisma.user.findUnique({
                where: { id: userAssigned_id }
            });

            if (!userExists) {
                throw new Error('Usuário atribuído não encontrado');
            }
        }


        if (project_id) {
            const projectExists = await prisma.project.findUnique({
                where: { id: project_id }
            });

            if (!projectExists) {
                throw new Error('Projeto não encontrado');
            }
        }

        const status = await prisma.statusItem.findUnique({
            where: { name: status_name || 'Inbox' }
        });

        if (!status) {
            throw new Error('Status não encontrado');
        }

        return await prisma.item.create({
            data: {
                title,
                description,
                user_id,
                userAssigned_id: userAssigned_id,
                status_id: status.id,
                ...(project_id && { project_id }),
                ...(due_date && { due_date: new Date(due_date) })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                assigned: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });
    }

    /**
     * Lista items com filtros
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Array>} Lista de items
     */
    async list(filters = {}) {
        const { user_id, project_id, status_id, search } = filters;

        const whereClause = {
            ...(status_id && { status_id: Number(status_id) }),
            ...(user_id && { user_id: Number(user_id) }),
            ...(project_id && { project_id: Number(project_id) }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        return await prisma.item.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                assigned: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true,
                _count: {
                    select: {
                        recorded_time: true
                    }
                }
            },
            orderBy: {
                created_date: 'desc'
            }
        });
    }

    /**
     * Busca item por ID
     * @param {number} id - ID do item
     * @returns {Promise<Object>} Item encontrado
     */
    async findById(id) {
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                },
                status: true,
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

        if (!item) {
            throw new Error('Item não encontrado');
        }

        const totalMinutes = item.recorded_time.reduce(
            (sum, record) => sum + record.minutes_duration,
            0
        );

        return {
            ...item,
            total_time_minutes: totalMinutes,
            total_time_hours: (totalMinutes / 60).toFixed(2)
        };
    }

    /**
     * Atualiza um item
     * @param {number} id - ID do item
     * @param {Object} data - Dados para atualizar
     * @returns {Promise<Object>} Item atualizado
     */
    async update(id, data) {
        const itemExists = await prisma.item.findUnique({
            where: { id }
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        const { title, description, status_id, due_date, project_id, user_id } = data;

        if (user_id && user_id !== itemExists.user_id) {
            const userExists = await prisma.user.findUnique({
                where: { id: user_id }
            });

            if (!userExists) {
                throw new Error('Usuário não encontrado');
            }
        }

        if (project_id && project_id !== itemExists.project_id) {
            const projectExists = await prisma.project.findUnique({
                where: { id: project_id }
            });

            if (!projectExists) {
                throw new Error('Projeto não encontrado');
            }
        }

        if (status_id) {
            const status = await prisma.statusItem.findUnique({
                where: { id: status_id }
            });

            if (!status) {
                throw new Error('Status não encontrado');
            }
        }

        return await prisma.item.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(status_id && { status_id }),
                ...(due_date !== undefined && { due_date: due_date ? new Date(due_date) : null }),
                ...(project_id !== undefined && { project_id }),
                ...(user_id && { user_id })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });
    }

    /**
     * Deleta um item
     * @param {number} id - ID do item
     */
    async delete(id) {
        const itemExists = await prisma.item.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        recorded_time: true
                    }
                }
            }
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        if (itemExists._count.recorded_time > 0) {
            console.warn(`Item ${id} tem ${itemExists._count.recorded_time} registros de tempo associados.`);
        }

        await prisma.item.delete({
            where: { id }
        });
    }

    /**
     * Busca items na caixa de entrada (inbox)
     * @param {number} userId - ID do usuário
     * @returns {Promise<Object>} Items na inbox
     */
    async getInbox(userId) {
        const items = await prisma.item.findMany({
            where: {
                user_id: userId,
                status: {
                    name: 'Inbox'
                }
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });

        return {
            count: items.length,
            items
        };
    }

    /**
     * Processa um item (sai da inbox)
     * @param {number} id - ID do item
     * @param {Object} data - Dados do processamento
     * @returns {Promise<Object>} Item processado
     */
    async processItem(id, data) {
        const item = await prisma.item.findUnique({
            where: { id },
            include: { status: true }
        });

        if (!item) {
            throw new Error('Item não encontrado');
        }

        if (item.status.name !== 'Inbox') {
            throw new Error('Item já foi processado');
        }

        const { is_actionable, status_id, due_date, userAssigned_id, priority } = data;

        return await prisma.item.update({
            where: { id },
            data: {
                status_id,
                ...(due_date && { due_date: new Date(due_date) }),
                ...(userAssigned_id && { userAssigned_id }),
                ...(priority && { priority })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });
    }

    /**
     * Atualiza status do item
     * @param {number} id - ID do item
     * @param {string} status_name - Nome do novo status
     * @returns {Promise<Object>} Item atualizado
     */
    async updateStatus(id, status_id) {
        const itemExists = await prisma.item.findUnique({
            where: { id }
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        const status = await prisma.statusItem.findUnique({
            where: { name: status_id }
        });

        if (!status) {
            throw new Error('Status inválido');
        }

        return await prisma.item.update({
            where: { id },
            data: { status_id: status.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });
    }

    /**
     * Marca item como concluído
     * @param {number} id - ID do item
     * @returns {Promise<Object>} Item concluído
     */
    async completeItem(id) {
        const itemExists = await prisma.item.findUnique({
            where: { id }
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        const status = await prisma.statusItem.findUnique({
            where: { name: 'Concluída' }
        });

        if (!status) {
            throw new Error('Status "Concluída" não encontrado');
        }

        return await prisma.item.update({
            where: { id },
            data: {
                status_id: status.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });
    }

    /**
     * Busca próximas ações do usuário
     * @param {number} userId - ID do usuário
     * @returns {Promise<Object>} Próximas ações
     */
    async getNextActions(userId) {
        const items = await prisma.item.findMany({
            where: {
                user_id: userId,
                status: {
                    name: 'Próxima Ação'
                }
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });

        return {
            count: items.length,
            items
        };
    }

    /**
     * Busca items aguardando outros
     * @param {number} userId - ID do usuário
     * @returns {Promise<Object>} Items aguardando
     */
    async getWaitingFor(userId) {
        const items = await prisma.item.findMany({
            where: {
                user_id: userId,
                status: {
                    name: 'Aguardando'
                }
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });

        return {
            count: items.length,
            items
        };
    }

    /**
     * Busca items agendados
     * @param {number} userId - ID do usuário
     * @returns {Promise<Object>} Items agendados
     */
    async getScheduled(userId) {
        const items = await prisma.item.findMany({
            where: {
                user_id: userId,
                status: {
                    name: 'Agendada'
                }
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });

        return {
            count: items.length,
            items
        };
    }

    /**
     * Busca items "algum dia/talvez"
     * @param {number} userId - ID do usuário
     * @returns {Promise<Object>} Items algum dia
     */
    async getSomedayMaybe(userId) {
        const items = await prisma.item.findMany({
            where: {
                user_id: userId,
                status: {
                    name: 'Algum Dia'
                }
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true
            }
        });

        return {
            count: items.length,
            items
        };
    }

    /**
     * Busca todos os items do usuário
     * @param {number} userId - ID do usuário
     * @returns {Promise<Array>} Items do usuário
     */
    async getByUser(userId) {
        return await prisma.item.findMany({
            where: { user_id: userId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: true,
                _count: {
                    select: {
                        recorded_time: true
                    }
                }
            },
            orderBy: {
                created_date: 'desc'
            }
        });
    }

    /**
     * Busca items de um projeto
     * @param {number} projectId - ID do projeto
     * @returns {Promise<Array>} Items do projeto
     */
    async getByProject(projectId) {
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        return await prisma.item.findMany({
            where: { project_id: projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                status: true,
                _count: {
                    select: {
                        recorded_time: true
                    }
                }
            },
            orderBy: {
                created_date: 'desc'
            }
        });
    }

    /**
     * Converte item em projeto
     * @param {number} id - ID do item
     * @param {Object} projectData - Dados do projeto
     * @returns {Promise<Object>} Projeto criado e item atualizado
     */
    async convertToProject(id, projectData) {
        const item = await prisma.item.findUnique({
            where: { id }
        });

        if (!item) {
            throw new Error('Item não encontrado');
        }

        const project = await prisma.project.create({
            data: {
                title: projectData.title || item.title,
                description: projectData.description || item.description,
                status: projectData.status || 'active'
            }
        });

        const nextActionStatus = await prisma.statusItem.findUnique({
            where: { name: 'Próxima Ação' }
        });

        const updatedItem = await prisma.item.update({
            where: { id },
            data: {
                project_id: project.id,
                status_id: nextActionStatus.id
            },
            include: {
                project: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                status: true
            }
        });

        return {
            project,
            item: updatedItem,
            message: 'Item convertido em projeto com sucesso'
        };
    }
}

export default new ItemService();