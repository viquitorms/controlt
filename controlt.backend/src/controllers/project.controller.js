import ProjectService from '../services/project.service.js';

class ProjectController {
  /**
   * Lista todos os projetos
   * @param {Request} req
   * @param {Response} res
   */
  async list(req, res) {
    try {
      const projects = await ProjectService.list();
      res.json(projects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Encontra um projeto pelo ID
   * @param {Request} req
   * @param {Response} res
   */
  async findById(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectService.findById(Number(id));
      res.json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Cria um novo projeto
   * @param {Request} req
   * @param {Response} res
   */
  async create(req, res) {
    try {
      const data = req.body;
      const project = await ProjectService.create(data);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Atualiza um projeto
   * @param {Request} req
   * @param {Response} res
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const project = await ProjectService.update(Number(id), data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Deleta um projeto
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ProjectController();