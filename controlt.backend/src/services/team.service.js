import prisma from "../config/prisma.config.js";

class TeamService {

    /**
     * Lista todas os equipes
     * @returns 
     */
    async list() {
        return await prisma.team.findMany({
            select: {
                id: true,
                name: true,
                created_date: true
            }
        })
    }


    /**
       * Busca equipe por ID
       * @param {number} id - ID da equipe
       * @returns {Promise<Object>} Equipe encontrada
       */
    async findById(id) {
        const team = await prisma.team.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                created_date: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profile: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!team) {
            throw new Error('Equipe não encontrada');
        }

        const formattedTeam = {
            id: team.id,
            name: team.name,
            created_date: team.created_date,
            members: team.users.map(ut => ut.user)
        };

        return formattedTeam;
    }

    /**
     * Cria uma equipe
     * @param {number} id - ID do projeto
     * @param {Object} data - Dados do projeto
     * @returns {Promise<Object>} Projeto atualizado ou criado
     */
    async create(data) {
        const { name } = data;

        return await prisma.team.create({
            data: {
                name: name,
            }
        })
    }

    /**
     * Atualiza uma equipe
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    async update(id, data) {
        const teamExists = await prisma.team.findUnique({
            where: { id }
        });

        if (!teamExists) {
            throw new Error('Equipe não encontrada');
        }

        const { name } = data;

        return await prisma.team.update({
            where: { id },
            data: {
                ...(name && { name }),
            },
            select: {
                id: true,
                name: true,
                created_date: true
            }
        });
    }

    /**
     * Deleta uma equipe
     * @param {*} id 
     */
    async delete(id) {
        await prisma.team.delete({
            where: { id }
        });
    }

    /**
     * Lista membros de uma equipe
     * @param {number} teamId - ID da equipe
     * @returns {Promise<Array>} Lista de membros
     */
    async getMembers(teamId) {
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        if (!team) {
            throw new Error('Equipe não encontrada');
        }

        const members = await prisma.userTeam.findMany({
            where: { team_id: teamId },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return members.map(m => m.user);
    }

    /**
   * Adiciona um membro à equipe
   * @param {number} teamId - ID da equipe
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Relacionamento criado
   */
    async addMember(teamId, userId) {
        // Verificar se equipe existe
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        if (!team) {
            throw new Error('Equipe não encontrada');
        }

        // Verificar se usuário existe
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar se já é membro
        const alreadyMember = await prisma.userTeam.findUnique({
            where: {
                user_id_team_id: {
                    user_id: userId,
                    team_id: teamId
                }
            }
        });

        if (alreadyMember) {
            throw new Error('Usuário já é membro desta equipe');
        }

        await prisma.userTeam.create({
            data: {
                user_id: userId,
                team_id: teamId
            }
        });

        return {
            message: 'Membro adicionado com sucesso',
            team_id: teamId,
            user_id: userId
        };
    }

    /**
   * Remove um membro da equipe
   * @param {number} teamId - ID da equipe
   * @param {number} userId - ID do usuário
   */
    async removeMember(teamId, userId) {
        // Verificar se relacionamento existe
        const userTeam = await prisma.userTeam.findUnique({
            where: {
                user_id_team_id: {
                    user_id: userId,
                    team_id: teamId
                }
            }
        });

        if (!userTeam) {
            throw new Error('Usuário não é membro desta equipe');
        }

        // Remover membro
        await prisma.userTeam.delete({
            where: {
                user_id_team_id: {
                    user_id: userId,
                    team_id: teamId
                }
            }
        });

        return {
            message: 'Membro removido com sucesso'
        };
    }
}

export default new TeamService();