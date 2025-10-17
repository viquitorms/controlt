import userService from '../services/user.service.js';
import UserService from '../services/user.service.js';

class UserController {

  /**
   * Lista todos os usuários
   * @param {*} req 
   * @param {*} res 
   */
  async list(req, res) {
    try {
      const users = await UserService.list();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Encontra um usuário pelo ID
   * @param {*} req 
   * @param {*} res 
   */
  async findById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(Number(id));
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Cria um novo usuário
   * @param {Request} req
   * @param {Response} res
   */
  async create(req, res) {
    try {
      const data = req.body;
      const user = await userService.create(data);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Atualiza um usuário
   * @param {*} req 
   * @param {*} res 
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await UserService.update(Number(id), data);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Deleta um usuário
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();