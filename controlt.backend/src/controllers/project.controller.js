/**
 * @author viquitorms
 * @version 2025-11-01 20:53:09
 * @description Controller simples para orquestrar requisições de Projects.
 */
import ProjectService from '../services/project.service.js';

class ProjectController {
  /**
   * Rota: POST /projects
   */
  static async create(req, res) {
    try {
      const project = await ProjectService.create(req.body);
      return res.status(201).json(project);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * Rota: GET /projects
   */
  static async findAll(req, res) {
    try {
      const projects = await ProjectService.findAll(req.query);
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
  }

  /**
   * Rota: GET /projects/:id
   */
  static async findById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const project = await ProjectService.findById(id);
      return res.status(200).json(project);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  /**
   * Rota: PUT /projects/:id
   */
  static async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const updatedProject = await ProjectService.update(id, req.body);
      return res.status(200).json(updatedProject);
    } catch (err) {
      const status = err.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({ error: err.message });
    }
  }

  /**
   * Rota: DELETE /projects/:id
   */
  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      await ProjectService.delete(id);
      return res.status(204).send();
    } catch (err) {
      const status = err.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({ error: err.message });
    }
  }
}

export default ProjectController;