// controllers/item.controller.js
import ItemService from '../services/item.service.js';

class ItemController {
    /**
     * Cria um novo item
     * @param {Request} req
     * @param {Response} res
     */
    static async create(req, res) {
        try {
            const item = await ItemService.create(req.body);
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
    static async findAll(req, res) {
        try {
            const items = await ItemService.findAll(req.query);
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Busca item por ID
     * @param {Request} req
     * @param {Response} res
     */
    static async findById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            const item = await ItemService.findById(id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Atualiza um item
     * @param {Request} req
     * @param {Response} res
     */
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            const updatedItem = await ItemService.update(id, req.body);
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deleta um item
     * @param {Request} req
     * @param {Response} res
     */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }
            await ItemService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default ItemController;