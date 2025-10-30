import TaskService from '../services/task.service.js';

class TaskController {
    /**
     * Cria um novo task
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        try {
            const task = await TaskService.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Lista tasks com filtros
     * @param {Request} req
     * @param {Response} res
     */
    async findAll(req, res) {
        try {
            const tasks = await TaskService.findAll(req.query);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca task por ID
     * @param {Request} req
     * @param {Response} res
     */
    async findById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            const task = await TaskService.findById(id);
            res.status(200).json(task);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Atualiza um task
     * @param {Request} req
     * @param {Response} res
     */
    async update(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            const updatedTask = await TaskService.update(id, req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deleta um task
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            await TaskService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new TaskController();