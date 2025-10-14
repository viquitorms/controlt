import prisma from '../config/prisma.config.js';

class TermService {
    /**
     * Lista todos os termos
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Array>} Lista de termos
     */
    async list(filters = {}) {
        const { search } = filters;

        return await prisma.term.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            select: {
                id: true,
                name: true,
                description: true,
                created_date: true,
                updated_date: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    /**
     * Busca termo por ID
     * @param {number} id - ID do termo
     * @returns {Promise<Object>} Termo encontrado
     */
    async findById(id) {
        const term = await prisma.term.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                created_date: true,
                updated_date: true
            }
        });

        if (!term) {
            throw new Error('Termo não encontrado');
        }

        return term;
    }

    /**
     * Busca termo por nome
     * @param {string} name - Nome do termo
     * @returns {Promise<Object>} Termo encontrado
     */
    async findByName(name) {
        const term = await prisma.term.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                created_date: true,
                updated_date: true
            }
        });

        if (!term) {
            throw new Error('Termo não encontrado');
        }

        return term;
    }

    /**
     * Cria um novo termo
     * @param {Object} data - Dados do termo
     * @returns {Promise<Object>} Termo criado
     */
    async create(data) {
        const { name, description } = data;

        // Validação
        if (!name) {
            throw new Error('Name é obrigatório');
        }

        // Verificar se termo já existe
        const termExists = await prisma.term.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });

        if (termExists) {
            throw new Error('Termo já cadastrado');
        }

        return await prisma.term.create({
            data: {
                name,
                description
            }
        });
    }

    /**
     * Atualiza um termo
     * @param {number} id - ID do termo
     * @param {Object} data - Dados para atualizar
     * @returns {Promise<Object>} Termo atualizado
     */
    async update(id, data) {
        const termExists = await prisma.term.findUnique({
            where: { id }
        });

        if (!termExists) {
            throw new Error('Termo não encontrado');
        }

        const { name, description } = data;

        // Se está atualizando o nome, verificar se não existe outro com o mesmo nome
        if (name && name !== termExists.name) {
            const nameInUse = await prisma.term.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    id: {
                        not: id
                    }
                }
            });

            if (nameInUse) {
                throw new Error('Já existe outro termo com este nome');
            }
        }

        return await prisma.term.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description })
            },
            select: {
                id: true,
                name: true,
                description: true,
                created_date: true,
                updated_date: true
            }
        });
    }

    /**
     * Deleta um termo
     * @param {number} id - ID do termo
     */
    async delete(id) {
        const termExists = await prisma.term.findUnique({
            where: { id }
        });

        if (!termExists) {
            throw new Error('Termo não encontrado');
        }

        await prisma.term.delete({
            where: { id }
        });
    }
}

export default new TermService();