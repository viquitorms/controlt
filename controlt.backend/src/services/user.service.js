import prisma from "../config/prisma.config";

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
                    select:{
                        id: true,
                        name:true,
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
     * Atualiza um usuário
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    async update(id, data){
        const {name, email, profile_id} = data;

        return await prisma.user.update({
            where: { id },
            data: {
                ...(name && { name}),
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
            where: {id}
        });
    }
}