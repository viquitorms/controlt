import statusItemService from "../services/statusItem.service.js";

class StatusItemController {

  /**
   * Lista todos os status de itens
   * @param {*} req 
   * @param {*} res 
   */
  async list(req, res) {
    try {
      const statuses = await statusItemService.list();
      res.json(statuses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new StatusItemController();