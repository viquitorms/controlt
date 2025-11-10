import StatusProjectService from '../services/statusProject.service.js';

class StatusProjectController {
    static async create(req, res) {
        try {
            const status = await StatusProjectService.create(req.body);
            return res.status(201).json(status);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async findAll(req, res) {
        try {
            const statuses = await StatusProjectService.findAll();
            return res.status(200).json(statuses);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar status de projeto.' });
        }
    }
}

export default StatusProjectController;