import TermService from '../services/term.service.js';

class TermController {
    /**
     * Lista todos os termos
     * @param {Request} req
     * @param {Response} res
     */
    static async list(req, res) {
        try {
            const { search } = req.query;
            const terms = await TermService.list({ search });
            res.json(terms);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca termo por ID
     * @param {Request} req
     * @param {Response} res
     */
    static async findById(req, res) {
        try {
            const { id } = req.params;
            const term = await TermService.findById(Number(id));
            res.json(term);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Busca termo por nome
     * @param {Request} req
     * @param {Response} res
     */
    static async findByName(req, res) {
        try {
            const { name } = req.params;
            const term = await TermService.findByName(name);
            res.json(term);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Cria um novo termo
     * @param {Request} req
     * @param {Response} res
     */
    static async create(req, res) {
        try {
            const data = req.body;
            const term = await TermService.create(data);
            res.status(201).json(term);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Atualiza um termo
     * @param {Request} req
     * @param {Response} res
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const term = await TermService.update(Number(id), data);
            res.json(term);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deleta um termo
     * @param {Request} req
     * @param {Response} res
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await TermService.delete(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default TermController;