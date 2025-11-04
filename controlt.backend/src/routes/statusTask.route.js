import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import CreateStatusTaskDto from "../dtos/statusTask/createStatusTask.dto.ts";
import statusTaskController from "../controllers/statusTask.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateStatusTaskDto), (req, res, next) => {
  /* 
    #swagger.path = '/status-tasks'
    #swagger.tags = ['Status Task']
    #swagger.summary = 'Criar novo status de tarefa'
    #swagger.description = 'Cria um novo status de tarefa no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do novo status',
      required: true,
      schema: { $ref: '#/definitions/CreateStatusTask' }
    }
    #swagger.responses[201] = {
      description: 'Status criado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return statusTaskController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  /* 
    #swagger.path = '/status-tasks's
    #swagger.tags = ['Status Task']
    #swagger.summary = 'Listar todos os status de tarefa'
    #swagger.description = 'Retorna uma lista de todos os status de tarefa'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Lista de status de tarefa'
    }
  */
  return statusTaskController.findAll(req, res, next);
});

export default router;