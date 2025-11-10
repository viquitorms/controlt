import { User } from '@prisma/client';
import prisma from '../config/prisma.config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { hash } from 'crypto';

class AuthService {
    static async Login(data: any): Promise<{ token: string; user: any }> {
        const { email, password } = data;

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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not configured');
        }

        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                profile_id: user.profile.id
            },
            secret,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile: {
                    id: user.profile.id,
                    name: user.profile.name
                }
            }
        };
    }
}

export default AuthService;