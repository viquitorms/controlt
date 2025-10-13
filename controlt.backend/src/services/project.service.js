import prisma from "../config/prisma.config.js";

class ProjectService {

    /**
     * Lista todos os projetos
     * @returns 
     */
    async list() {
        return await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                created_date: true
            }
        })
    }

    /**
     * Encontra um projeto pelo ID
     * @param {*} id 
     * @returns 
     */
    async findById(id) {
        const project = await prisma.project.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                created_date: true
            }
        })

        if (!project) {
            throw new Error('Projeto não encontrado');
        }

        return project;
    }

    /**
     * Cria um projeto
     * @param {number} id - ID do projeto
     * @param {Object} data - Dados do projeto
     * @returns {Promise<Object>} Projeto atualizado ou criado
     */
    async create(data) {
        const { title, description, status } = data;

        return await prisma.project.create({
            data: {
                title,
                description,
                status,
            }
        })
    }

    /**
     * Atualiza um projeto
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    async update(id, data) {
        const projectExists = await prisma.project.findUnique({
            where: { id }
        });

        if (!projectExists) {
            throw new Error('Projeto não encontrado');
        }

        const { title, description, status } = data;

        return await prisma.project.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status })
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                created_date: true
            }
        });
    }

    /**
     * Deleta um usuário
     * @param {*} id 
     */
    async delete(id) {
        await prisma.project.delete({
            where: { id }
        });
    }
}

export default new ProjectService();