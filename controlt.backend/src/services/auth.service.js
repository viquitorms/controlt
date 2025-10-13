import prisma from '../config/prisma.config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthService {

    /**
     * Realiza o login do usuário
     * @param {*} name 
     * @param {*} password 
     * @returns 
     */
    async Login (email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            throw new Error('Usuário não encontrado ou senha inválida');
        }

        const isPasswordValid = await bcrypt.compare(password, user.hash_password);

        if (!isPasswordValid) {
            throw new Error('Usuário não encontrado ou senha inválida');
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, profile: user.profile },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Define a data de expiração do token
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile
            }
        };
    }

    /**
     * Registra um novo usuário
     * @param {*} data 
     * @returns 
     */
    async register (data) {
        const { name, email, password, profile_id} = data;

        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            throw new Error('Email já cadastrado');
        }

        const hash_password = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hash_password,
                profile_id: profile_id || 2 // Define o perfil padrão como 2 (colaborador comum)
            },
            include: { profile: true }
        });

        const { hash_password: _, ...userWithoutPassword } = user; // Remove a senha do objeto retornado
        return userWithoutPassword;
    }
}

export default new AuthService()