import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import profileController from '../controllers/profile.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  /* 
    #swagger.path = '/profiles'
    #swagger.tags = ['Profiles']
    #swagger.summary = 'Listar todos os perfis'
    #swagger.description = 'Retorna uma lista de todos os perfis de usuário'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Lista de perfis'
    }
  */
  return profileController.list(req, res, next);
});

export default router;