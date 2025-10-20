// controllers/item.controller.js
import ItemService from '../services/item.service.js';

class ItemController {
    /**
     * Cria um novo item
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        try {
            const data = req.body;
            const item = await ItemService.create(data);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Lista items com filtros
     * @param {Request} req
     * @param {Response} res
     */
    async list(req, res) {
        try {
            const filters = req.query;
            const items = await ItemService.list(filters);
            res.json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca item por ID
     * @param {Request} req
     * @param {Response} res
     */
    async findById(req, res) {
        try {
            const { id } = req.params;
            const item = await ItemService.findById(Number(id));
            res.json(item);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Atualiza um item
     * @param {Request} req
     * @param {Response} res
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const item = await ItemService.update(Number(id), data);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deleta um item
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await ItemService.delete(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca inbox do usuário
     * @param {Request} req
     * @param {Response} res
     */
    async getInbox(req, res) {
        try {
            const { userId } = req.params;
            const inbox = await ItemService.getInbox(Number(userId));
            res.json(inbox);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Processa um item
     * @param {Request} req
     * @param {Response} res
     */
    async processItem(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const item = await ItemService.processItem(Number(id), data);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Atualiza status do item
     * @param {Request} req
     * @param {Response} res
     */
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status_id } = req.body;
            const item = await ItemService.updateStatus(Number(id), status_id);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Marca item como concluído
     * @param {Request} req
     * @param {Response} res
     */
    async completeItem(req, res) {
        try {
            const { id } = req.params;
            const item = await ItemService.completeItem(Number(id));
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca próximas ações
     * @param {Request} req
     * @param {Response} res
     */
    async getNextActions(req, res) {
        try {
            const { userId } = req.params;
            const actions = await ItemService.getNextActions(Number(userId));
            res.json(actions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca items aguardando
     * @param {Request} req
     * @param {Response} res
     */
    async getWaitingFor(req, res) {
        try {
            const { userId } = req.params;
            const waiting = await ItemService.getWaitingFor(Number(userId));
            res.json(waiting);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca items agendados
     * @param {Request} req
     * @param {Response} res
     */
    async getScheduled(req, res) {
        try {
            const { userId } = req.params;
            const scheduled = await ItemService.getScheduled(Number(userId));
            res.json(scheduled);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca items algum dia/talvez
     * @param {Request} req
     * @param {Response} res
     */
    async getSomedayMaybe(req, res) {
        try {
            const { userId } = req.params;
            const someday = await ItemService.getSomedayMaybe(Number(userId));
            res.json(someday);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca items do usuário
     * @param {Request} req
     * @param {Response} res
     */
    async getByUser(req, res) {
        try {
            const { userId } = req.params;
            const items = await ItemService.getByUser(Number(userId));
            res.json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca items do projeto
     * @param {Request} req
     * @param {Response} res
     */
    async getByProject(req, res) {
        try {
            const { projectId } = req.params;
            const items = await ItemService.getByProject(Number(projectId));
            res.json(items);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Converte item em projeto
     * @param {Request} req
     * @param {Response} res
     */
    async convertToProject(req, res) {
        try {
            const { id } = req.params;
            const projectData = req.body;
            const result = await ItemService.convertToProject(Number(id), projectData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ItemController();