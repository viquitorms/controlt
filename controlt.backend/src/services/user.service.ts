import prisma from "../config/prisma.config.js"; // Se este arquivo for .js, mantenha. Se for .ts, mude a extensão.
import bcrypt from "bcryptjs";
import CreateUserDto from "../dtos/user/createUser.dto.js";
import UpdateUserDto from "../dtos/user/updateUser.dto.js";
import { User } from "@prisma/client";

interface UserResponse {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        name: string;
    };
    created_date: Date;
}

class UserService {
    /**
     * Lista todos os usuários, exceto o admin.
     */
    async findAll(): Promise<UserResponse[]> {
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
            where: {
                name: {
                    not: 'admin'
                },
                email: {
                    not: 'admin@controlt.com'
                }
            },
            orderBy: {
                id: 'asc'
            }
        });
    }

    /**
     * Encontra um usuário pelo ID.
     */
    async findById(id: number): Promise<UserResponse | null> {
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
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    /**
     * Cria um novo usuário.
     */
    async create(data: CreateUserDto): Promise<UserResponse> {
        const { name, email, password, profile_id } = data;

        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            throw new Error(`O email '${email}' já está registrado.`);
        }

        const hash_password = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
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

        return newUser;
    }

    /**
     * Atualiza um usuário.
     */
    async update(id: number, data: UpdateUserDto): Promise<UserResponse> {
        const { name, email, profile_id, password } = data;

        const dataToUpdate: any = {
            ...(name && { name }),
            ...(email && { email }),
            ...(profile_id && { profile_id }),
        };

        if (password) {
            dataToUpdate.hash_password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
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

        return updatedUser;
    }

    /**
     * Deleta um usuário.
     */
    async delete(id: number): Promise<void> {
        await this.findById(id);
        await prisma.user.delete({
            where: { id }
        });
    }
}

export default new UserService();