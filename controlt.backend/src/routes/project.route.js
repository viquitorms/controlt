import { Router } from "express";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CreateProjectDto from "../dtos/project/createProject.dto.ts";
import UpdateProjectDto from "../dtos/project/updateProject.dto.ts";
import FilterProjectDto from "../dtos/project/filterProject.dto.ts";
import projectController from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateProjectDto), (req, res, next) => {
  /* 
    #swagger.path = '/projects'
    #swagger.tags = ['Projects']
    #swagger.summary = 'Criar novo projeto'
    #swagger.description = 'Cria um novo projeto no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo projeto',
      required: true,
      schema: { $ref: '#/definitions/CreateProject' }
    }
    #swagger.responses[201] = {
      description: 'Projeto criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return projectController.create(req, res, next);
});

router.get("/", validateDto(FilterProjectDto), (req, res, next) => {
  /* 
    #swagger.path = '/projects'
    #swagger.tags = ['Projects']
    #swagger.summary = 'Listar projetos com filtros'
    #swagger.description = 'Retorna uma lista de projetos com filtros opcionais'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'Filtros de busca',
      schema: { $ref: '#/definitions/FilterProject' }
    }
    #swagger.responses[200] = {
      description: 'Lista de projetos'
    }
  */
  return projectController.findAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  /* 
    #swagger.path = '/projects/{id}'
    #swagger.tags = ['Projects']
    #swagger.summary = 'Buscar projeto por ID'
    #swagger.description = 'Retorna os dados de um projeto específico'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do projeto',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Projeto encontrado'
    }
    #swagger.responses[404] = {
      description: 'Projeto não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return projectController.findById(req, res, next);
});

router.put("/:id", validateDto(UpdateProjectDto), (req, res, next) => {
  /* 
    #swagger.path = '/projects/{id}'
    #swagger.tags = ['Projects']
    #swagger.summary = 'Atualizar projeto'
    #swagger.description = 'Atualiza os dados de um projeto existente'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do projeto',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados do projeto',
      required: true,
      schema: { $ref: '#/definitions/UpdateProject' }
    }
    #swagger.responses[200] = {
      description: 'Projeto atualizado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Projeto não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return projectController.update(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  /* 
    #swagger.path = '/projects/{id}'
    #swagger.tags = ['Projects']
    #swagger.summary = 'Deletar projeto'
    #swagger.description = 'Remove um projeto do sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do projeto',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Projeto deletado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Projeto não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return projectController.delete(req, res, next);
});

export default router;