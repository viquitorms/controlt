// SUBSTITUIR O CONTEÚDO INTEIRO DESTE ARQUIVO

import prisma from "../config/prisma.config.js";

class RecordedTimeService {
    /**
     * Lista todos os tempos registrados.
     * @returns {Promise<Array>}
     */
    async findAll() {
        return prisma.recordedTime.findMany();
    }

    /**
     * Cria um novo registro de tempo.
     * @param {object} data - Dados para o novo registro.
     * @returns {Promise<object>}
     */
    async create(data) {
        return prisma.recordedTime.create({
            data,
        });
    }

    /**
     * Atualiza um registro de tempo.
     * @param {number} id - ID do registro.
     * @param {object} data - Dados para atualizar.
     * @returns {Promise<object>}
     */
    async update(id, data) {
        return prisma.recordedTime.update({
            where: { id: parseInt(id) }, // Garante que o ID é um inteiro
            data,
        });
    }

    /**
     * Remove um registro de tempo.
     * @param {number} id - ID do registro.
     * @returns {Promise<object>}
     */
    async remove(id) {
        return prisma.recordedTime.delete({
            where: { id: parseInt(id) }, // CORREÇÃO: Adicionado parseInt
        });
    }

    /**
     * Para qualquer temporizador ativo para um usuário específico.
     * @param {number} userId - O ID do usuário. // CORREÇÃO: Deve ser userId
     * @returns {Promise<object|null>} O registro parado ou nulo.
     */
    async stopActiveTimer(userId) { // CORREÇÃO: Parâmetro é userId
        const activeRecord = await prisma.recordedTime.findFirst({
            where: {
                userId: parseInt(userId), // CORREÇÃO: Buscar pelo userId
                endedAt: null,
            },
        });

        if (activeRecord) {
            return prisma.recordedTime.update({
                where: { id: activeRecord.id },
                data: { endedAt: new Date() },
            });
        }
        return null;
    }

    /**
     * Inicia um novo registro de rastreamento de tempo para um item.
     * Para qualquer outro temporizador ativo para o usuário.
     * @param {number} itemId - O ID do item.
     * @param {number} userId - O ID do usuário.
     * @returns {Promise<object>} O novo registro RecordedTime.
     */
    async startTracking(itemId, userId) {

        // CORREÇÃO: Chamado com userId, não 'item'
        await this.stopActiveTimer(userId);

        // Inicia um novo temporizador
        return prisma.recordedTime.create({
            data: {
                // CORREÇÃO (Linha 95 do seu arquivo): O campo é 'itemId', não 'id'
                itemId: parseInt(itemId),
                userId: parseInt(userId), // Garante que é inteiro
                startedAt: new Date(),
                endedAt: null,
            },
        });
    }

    /**
     * Para o rastreamento de tempo para um item específico.
     * @param {number} itemId - O ID do item.
     * @param {number} userId - O ID do usuário.
     * @returns {Promise<object|null>} O registro RecordedTime parado ou nulo se não for encontrado.
     */
    async stopTracking(itemId, userId) {
        const activeRecord = await prisma.recordedTime.findFirst({
            where: {
                itemId: parseInt(itemId),
                userId: parseInt(userId),
                endedAt: null,
            },
            orderBy: {
                startedAt: 'desc', // Pega o mais recente
            },
        });

        if (activeRecord) {
            return prisma.recordedTime.update({
                where: { id: activeRecord.id },
                data: { endedAt: new Date() },
            });
        }
        // Se nenhum registro ativo para este item, apenas retorna nulo.
        return null;
    }

    /**
     * Encontra o temporizador atualmente ativo para um usuário.
     * @param {number} userId - O ID do usuário.
     * @returns {Promise<object|null>} O registro ativo ou nulo.
     */
    async getActiveTracking(userId) {
        return prisma.recordedTime.findFirst({
            where: {
                userId: parseInt(userId),
                endedAt: null,
            },
            include: {
                item: true, // Inclui detalhes do item, útil para o frontend
            },
        });
    }
}

export default new RecordedTimeService();