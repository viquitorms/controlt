import { Router } from 'express';
import teamController from '../controllers/team.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', (req, res, next) => {
  /* 
    #swagger.path = '/teams'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Criar nova equipe'
    #swagger.description = 'Cria uma nova equipe no sistema'
    #swagger.security = []
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados da nova equipe',
      required: true
    }
    #swagger.responses[201] = {
      description: 'Equipe criada com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.create(req, res, next);
});

router.get('/', (req, res, next) => {
  /* 
    #swagger.path = '/teams'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Listar todas as equipes'
    #swagger.description = 'Retorna uma lista de todas as equipes'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de equipes'
    }
  */
  return teamController.list(req, res, next);
});

router.get('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Buscar equipe por ID'
    #swagger.description = 'Retorna os dados de uma equipe específica'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Equipe encontrada'
    }
    #swagger.responses[404] = {
      description: 'Equipe não encontrada',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.findById(req, res, next);
});

router.put('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Atualizar equipe'
    #swagger.description = 'Atualiza os dados de uma equipe existente'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados da equipe',
      required: true
    }
    #swagger.responses[200] = {
      description: 'Equipe atualizada com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Equipe não encontrada',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.update(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Deletar equipe'
    #swagger.description = 'Remove uma equipe do sistema'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Equipe deletada com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Equipe não encontrada',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.delete(req, res, next);
});

router.get('/:id/members', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}/members'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Listar membros da equipe'
    #swagger.description = 'Retorna todos os membros de uma equipe específica'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Lista de membros'
    }
    #swagger.responses[404] = {
      description: 'Equipe não encontrada',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.getMembers(req, res, next);
});

router.post('/:id/members', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}/members'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Adicionar membro à equipe'
    #swagger.description = 'Adiciona um novo membro a uma equipe'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'ID do usuário a ser adicionado',
      required: true
    }
    #swagger.responses[200] = {
      description: 'Membro adicionado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Equipe ou usuário não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.addMember(req, res, next);
});

router.delete('/:id/members/:userId', (req, res, next) => {
  /* 
    #swagger.path = '/teams/{id}/members/{userId}'
    #swagger.tags = ['Teams']
    #swagger.summary = 'Remover membro da equipe'
    #swagger.description = 'Remove um membro de uma equipe'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da equipe',
      required: true,
      type: 'string'
    }
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'ID do usuário a ser removido',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Membro removido com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Equipe ou usuário não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return teamController.removeMember(req, res, next);
});

export default router;