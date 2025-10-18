import prisma from '../config/prisma.config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthService {
    async Login(data) {
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

        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                profile_id: user.profile.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile // Retorna o objeto profile na resposta, mas não no token
            }
        };
    }
}

export default new AuthService()