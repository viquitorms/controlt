import statusTaskService from "../services/statusTask.service.js";

class StatusProjectController {
    static async create(req, res) {
        try {
            const status = await statusTaskService.create(req.body);
            return res.status(201).json(status);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const statuses = await statusTaskService.findAll();
            return res.status(200).json(statuses);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default StatusProjectController;