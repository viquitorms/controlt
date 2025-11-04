import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateUserDto from '../dtos/user/createUser.dto.ts';
import UpdateUserDto from '../dtos/user/updateUser.dto.ts';

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateUserDto), (req, res, next) => {
  /* 
    #swagger.path = '/users'
    #swagger.tags = ['Users']
    #swagger.summary = 'Criar novo usuário'
    #swagger.description = 'Cria um novo usuário no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo usuário',
      required: true,
      schema: { $ref: '#/definitions/CreateUser' }
    }
    #swagger.responses[201] = {
      description: 'Usuário criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return userController.create(req, res, next);
});

router.put("/:id", validateDto(UpdateUserDto), (req, res, next) => {
  /* 
    #swagger.path = '/users/{id}'
    #swagger.tags = ['Users']
    #swagger.summary = 'Atualizar usuário'
    #swagger.description = 'Atualiza os dados de um usuário existente'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados do usuário',
      required: true,
      schema: { $ref: '#/definitions/UpdateUser' }
    }
    #swagger.responses[200] = {
      description: 'Usuário atualizado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Usuário não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return userController.update(req, res, next);
});

router.get("/", (req, res, next) => {
  /* 
    #swagger.path = '/users'
    #swagger.tags = ['Users']
    #swagger.summary = 'Listar todos os usuários'
    #swagger.description = 'Retorna uma lista de todos os usuários cadastrados'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Lista de usuários'
    }
  */
  return userController.findAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  /* 
    #swagger.path = '/users/{id}'
    #swagger.tags = ['Users']
    #swagger.summary = 'Buscar usuário por ID'
    #swagger.description = 'Retorna os dados de um usuário específico'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Usuário encontrado'
    }
    #swagger.responses[404] = {
      description: 'Usuário não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return userController.findById(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  /* 
    #swagger.path = '/users/{id}'
    #swagger.tags = ['Users']
    #swagger.summary = 'Deletar usuário'
    #swagger.description = 'Remove um usuário do sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Usuário deletado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Usuário não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return userController.delete(req, res, next);
});

export default router;