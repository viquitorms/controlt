import recordedTimeService from "../services/recordedTime.service.js";

class RecordedTimeController {
    async findAll(req, res) {
        try {
            const recordedTimes = await recordedTimeService.findAll();
            res.status(200).json(recordedTimes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const newRecordedTime = await recordedTimeService.create(req.body);
            res.status(201).json(newRecordedTime);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedRecordedTime = await recordedTimeService.update(
                req.params.id,
                req.body
            );
            res.status(200).json(updatedRecordedTime);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async remove(req, res) {
        try {
            await recordedTimeService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Controller para iniciar o rastreamento de tempo.
     * Espera { itemId } no corpo da requisição.
     * Usa req.user.id para o usuário.
     */
    async startTracking(req, res) {
        try {
            const { itemId } = req.body;
            const userId = req.user.id;

            if (!itemId) {
                return res.status(400).json({ message: 'itemId é obrigatório' });
            }

            const newRecord = await recordedTimeService.startTracking(itemId, userId);
            res.status(201).json(newRecord);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Controller para parar o rastreamento de tempo.
     * Espera { itemId } no corpo da requisição.
     * Usa req.user.id para o usuário.
     */
    async stopTracking(req, res) {
        try {
            const { itemId } = req.body;
            const userId = req.user.id; // Vem do auth middleware

            if (!itemId) {
                return res.status(400).json({ message: 'itemId é obrigatório' });
            }

            const stoppedRecord = await recordedTimeService.stopTracking(itemId, userId);

            if (!stoppedRecord) {
                // Isso não é um erro, apenas significa que nenhum timer ativo foi encontrado
                return res
                    .status(200)
                    .json({ message: 'Nenhum temporizador ativo encontrado para este item.' });
            }

            res.status(200).json(stoppedRecord);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Controller para obter o temporizador ativo para o usuário.
     */
    async getActiveTracking(req, res) {
        try {
            const userId = req.user.id;
            const activeRecord = await recordedTimeService.getActiveTracking(userId);
            res.status(200).json(activeRecord); // Será nulo se nada estiver ativo
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new RecordedTimeController();