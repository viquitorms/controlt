import { Router } from "express";
import statusProjectController from "../controllers/statusProject.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CreateStatusProjectDto from "../dtos/statusProject/createStatusProject.dto.ts";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateStatusProjectDto), (req, res, next) => {
  /* 
    #swagger.path = '/status-projects'
    #swagger.tags = ['Status Project']
    #swagger.summary = 'Criar novo status de projeto'
    #swagger.description = 'Cria um novo status de projeto no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo status',
      required: true,
      schema: { $ref: '#/definitions/CreateStatusProject' }
    }
    #swagger.responses[201] = {
      description: 'Status criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return statusProjectController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  /* 
    #swagger.path = '/status-projects'
    #swagger.tags = ['Status Project']
    #swagger.summary = 'Listar todos os status de projeto'
    #swagger.description = 'Retorna uma lista de todos os status de projeto'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Lista de status de projeto'
    }
  */
  return statusProjectController.findAll(req, res, next);
});

export default router;