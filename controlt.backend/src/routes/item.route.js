import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateItemDto from '../dtos/item/createItem.dto.ts';
import FilterItemDto from '../dtos/item/filterItem.dto.ts';
import UpdateItemDto from '../dtos/item/updateItem.dto.ts';

const router = Router();

router.use(authMiddleware);

router.post('/', validateDto(CreateItemDto), (req, res, next) => {
  /* 
    #swagger.path = '/items'
    #swagger.tags = ['Items']
    #swagger.summary = 'Criar novo item'
    #swagger.description = 'Cria um novo item no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo item',
      required: true,
      schema: { $ref: '#/definitions/CreateItem' }
    }
    #swagger.responses[201] = {
      description: 'Item criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return itemController.create(req, res, next);
});

router.get('/', validateDto(FilterItemDto), (req, res, next) => {
  /* 
    #swagger.path = '/items'
    #swagger.tags = ['Items']
    #swagger.summary = 'Listar itens com filtros'
    #swagger.description = 'Retorna uma lista de itens com filtros opcionais'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'Filtros de busca',
      schema: { $ref: '#/definitions/ItemFilter' }
    }
    #swagger.responses[200] = {
      description: 'Lista de itens'
    }
  */
  return itemController.findAll(req, res, next);
});

router.get('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/items/{id}'
    #swagger.tags = ['Items']
    #swagger.summary = 'Buscar item por ID'
    #swagger.description = 'Retorna os dados de um item específico'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Item encontrado'
    }
    #swagger.responses[404] = {
      description: 'Item não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return itemController.findById(req, res, next);
});

router.put('/:id', validateDto(UpdateItemDto), (req, res, next) => {
  /* 
    #swagger.path = '/items/{id}'
    #swagger.tags = ['Items']
    #swagger.summary = 'Atualizar item'
    #swagger.description = 'Atualiza os dados de um item existente'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados do item',
      required: true,
      schema: { $ref: '#/definitions/UpdateItem' }
    }
    #swagger.responses[200] = {
      description: 'Item atualizado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Item não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return itemController.update(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  /* 
    #swagger.path = '/items/{id}'
    #swagger.tags = ['Items']
    #swagger.summary = 'Deletar item'
    #swagger.description = 'Remove um item do sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Item deletado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Item não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return itemController.delete(req, res, next);
});

export default router;