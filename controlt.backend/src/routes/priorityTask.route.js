import { Router } from "express";
import priorityTaskController from "../controllers/priorityTask.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import CreatePriorityTaskDto from "../dtos/priorityTask/createPriorityTask.dto.ts";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreatePriorityTaskDto), (req, res, next) => {
  /* 
    #swagger.path = '/priority-tasks'
    #swagger.tags = ['Priority Tasks']
    #swagger.summary = 'Criar nova prioridade de tarefa'
    #swagger.description = 'Cria uma nova prioridade de tarefa no sistema'
    #swagger.security = []
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados da nova prioridade',
      required: true,
      schema: { $ref: '#/definitions/CreatePriorityTask' }
    }
    #swagger.responses[201] = {
      description: 'Prioridade criada com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return priorityTaskController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  /* 
    #swagger.path = '/priority-tasks'
    #swagger.tags = ['Priority Tasks']
    #swagger.summary = 'Listar todas as prioridades'
    #swagger.description = 'Retorna uma lista de todas as prioridades de tarefas'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de prioridades'
    }
  */
  return priorityTaskController.findAll(req, res, next);
});

export default router;