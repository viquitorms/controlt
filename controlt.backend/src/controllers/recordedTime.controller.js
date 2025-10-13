import RecordedTimeService from '../services/recordedTime.service.js';

class RecordedTimeController {
    /**
     * Registra tempo
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        try {
            const data = req.body;
            const record = await RecordedTimeService.create(data);
            res.status(201).json(record);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Lista registros de tempo
     * @param {Request} req
     * @param {Response} res
     */
    async list(req, res) {
        try {
            const filters = req.query;
            const records = await RecordedTimeService.list(filters);
            res.json(records);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca registro por ID
     * @param {Request} req
     * @param {Response} res
     */
    async findById(req, res) {
        try {
            const { id } = req.params;
            const record = await RecordedTimeService.findById(Number(id));
            res.json(record);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Atualiza registro
     * @param {Request} req
     * @param {Response} res
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const record = await RecordedTimeService.update(Number(id), data);
            res.json(record);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deleta registro
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await RecordedTimeService.delete(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Tempo total por item
     * @param {Request} req
     * @param {Response} res
     */
    async getTimeByItem(req, res) {
        try {
            const { itemId } = req.params;
            const data = await RecordedTimeService.getTimeByItem(Number(itemId));
            res.json(data);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Tempo total por usuário
     * @param {Request} req
     * @param {Response} res
     */
    async getTimeByUser(req, res) {
        try {
            const { userId } = req.params;
            const { start_date, end_date } = req.query;
            const data = await RecordedTimeService.getTimeByUser(Number(userId), { start_date, end_date });
            res.json(data);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Tempo total por projeto
     * @param {Request} req
     * @param {Response} res
     */
    async getTimeByProject(req, res) {
        try {
            const { projectId } = req.params;
            const data = await RecordedTimeService.getTimeByProject(Number(projectId));
            res.json(data);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default new RecordedTimeController();