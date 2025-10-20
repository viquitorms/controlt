import authService from "../services/auth.service.js";

class AuthController {

    /**
     * Realiza o login do usuário
     * @param {*} req 
     * @param {*} res 
     */
    async login(req, res) {
        try {
            const data = req.body;
            const result = await authService.Login(data);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new AuthController();