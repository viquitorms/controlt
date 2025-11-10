import profileService from "../services/profile.service.js";

class UserController {

  /**
   * Lista todos os usuários
   * @param {*} req 
   * @param {*} res 
   */
  static async list(req, res) {
    try {
      const profiles = await profileService.list();
      res.json(profiles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;