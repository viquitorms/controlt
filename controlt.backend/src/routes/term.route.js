import { Router } from 'express';
import termController from '../controllers/term.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', (req, res, next) => {
  /* 
    #swagger.path = '/terms'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Criar novo termo'
    #swagger.description = 'Cria um novo termo no sistema'
    #swagger.security = []
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo termo',
      required: true
    }
    #swagger.responses[201] = {
      description: 'Termo criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return termController.create(req, res, next);
});

router.get('/', (req, res, next) => {
  /* 
    #swagger.path = '/terms'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Listar todos os termos'
    #swagger.description = 'Retorna uma lista de todos os termos'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de termos'
    }
  */
  return termController.list(req, res, next);
});

router.get('/search/:name', (req, res, next) => {
  /* 
    #swagger.path = '/terms/search/{name}'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Buscar termo por nome'
    #swagger.description = 'Busca termos pelo nome'
    #swagger.security = []
    #swagger.parameters['name'] = {
      in: 'path',
      description: 'Nome do termo',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Termo(s) encontrado(s)'
    }
    #swagger.responses[404] = {
      description: 'Termo não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return termController.findByName(req, res, next);
});

router.get('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/terms/{id}'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Buscar termo por ID'
    #swagger.description = 'Retorna os dados de um termo específico'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do termo',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Termo encontrado'
    }
    #swagger.responses[404] = {
      description: 'Termo não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return termController.findById(req, res, next);
});

router.put('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/terms/{id}'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Atualizar termo'
    #swagger.description = 'Atualiza os dados de um termo existente'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do termo',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados do termo',
      required: true
    }
    #swagger.responses[200] = {
      description: 'Termo atualizado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Termo não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return termController.update(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/terms/{id}'
    #swagger.tags = ['Terms']
    #swagger.summary = 'Deletar termo'
    #swagger.description = 'Remove um termo do sistema'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do termo',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Termo deletado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Termo não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return termController.delete(req, res, next);
});

export default router;