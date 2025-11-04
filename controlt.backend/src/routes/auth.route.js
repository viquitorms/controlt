import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import LoginDto from '../dtos/auth/login.dto.ts';

const router = Router();

router.post('/login', validateDto(LoginDto), (req, res, next) => {
  /* 
    #swagger.path = '/auth/login'
    #swagger.tags = ['Auth']
    #swagger.description = 'Autenticar usuário'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Credenciais de login',
      required: true,
      schema: { $ref: '#/definitions/Login' }
    }
    #swagger.responses[200] = {
      description: 'Login realizado com sucesso'
    }
    #swagger.responses[401] = {
      description: 'Credenciais inválidas'
    }
  */
  return AuthController.login(req, res, next);
});

export default router;