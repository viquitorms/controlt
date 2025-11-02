import recordedTimeService from "../services/recordedTime.service.js";

class RecordedTimeController {

    /**
     * Rota: POST /recorded-time/start
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async start(req, res) {
        try {
            const user_id = req.user.id;
            const timer = await recordedTimeService.start(req.body, user_id);
            return res.status(201).json(timer);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async stop(req, res) {
        try {
            const user_id = req.user.id;
            const timer = await recordedTimeService.stop(user_id);
            return res.status(200).json(timer);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const records = await recordedTimeService.findAll(req.query);
            return res.status(200).json(records);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async getActiveTimer(req, res) {
        try {
            const user_id = req.user.id;
            const timer = await recordedTimeService.getActiveTimer(user_id);
            return res.status(200).json(timer);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

            const user_id = req.user.id;
            await recordedTimeService.delete(id, user_id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default RecordedTimeController;