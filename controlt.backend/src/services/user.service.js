import prisma from "../config/prisma.config.js";
import bcrypt from "bcryptjs";

class UserSerivce {

    /**
     * Lista todos os usuários
     * @returns 
     */
    async list() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                created_date: true
            },
            orderBy: {
                id: 'asc'
            }
        })
    }

    /**
     * Encontra um usuário pelo ID
     * @param {*} id 
     * @returns 
     */
    async findById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                created_date: true
            }
        })

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    /**
     * Cria um novo usuário
     * @param {Object} data - Dados do usuário
     * @returns {Promise<Object>} Usuário criado
     */
    async create(data) {
        const { name, email, password, profile_id } = data;

        if (!name || !email || !password) {
            throw new Error('Nome, email e senha são obrigatórios');
        }

        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            throw new Error('Email já registrado');
        }

        const hash_password = await bcrypt.hash(password, 10);

        return await prisma.user.create({
            data: {
                name,
                email,
                hash_password,
                profile_id: profile_id || 2
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                created_date: true
            }
        });
    }

    /**
     * Atualiza um usuário
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    async update(id, data) {
        const { name, email, profile_id } = data;

        return await prisma.user.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(profile_id && { profile_id })
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile: true
            }
        });
    }

    /**
     * Deleta um usuário
     * @param {*} id 
     */
    async delete(id) {
        await prisma.user.delete({
            where: { id }
        });
    }
}

export default new UserSerivce();