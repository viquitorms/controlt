import TeamService from '../services/team.service.js';

class TeamController {
  /**
   * Lista todas as equipes
   * @param {Request} req
   * @param {Response} res
   */
  static async list(req, res) {
    try {
      const teams = await TeamService.list();
      res.json(teams);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Encontra uma equipe pelo ID
   * @param {Request} req
   * @param {Response} res
   */
  static async findById(req, res) {
    try {
      const { id } = req.params;
      const team = await TeamService.findById(Number(id));
      res.json(team);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Cria uma nova equipe
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const data = req.body;
      const team = await TeamService.create(data);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Atualiza uma equipe
   * @param {Request} req
   * @param {Response} res
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const team = await TeamService.update(Number(id), data);
      res.json(team);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Deleta um projeto
   * @param {Request} req
   * @param {Response} res
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await TeamService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Lista membros de uma equipe
   * @param {Request} req
   * @param {Response} res
   */
  static async getMembers(req, res) {
    try {
      const { id } = req.params;
      const members = await TeamService.getMembers(Number(id));
      res.json(members);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Adiciona um membro à equipe
   * @param {Request} req
   * @param {Response} res
   */
  static async addMember(req, res) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const result = await TeamService.addMember(Number(id), Number(user_id));
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Remove um membro da equipe
   * @param {Request} req
   * @param {Response} res
   */
  static async removeMember(req, res) {
    try {
      const { id, userId } = req.params;
      const result = await TeamService.removeMember(Number(id), Number(userId));
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TeamController;