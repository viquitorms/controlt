import { Router } from "express";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import TaskFilterDto from "../dtos/task/filterTask.dto.js";
import CreateTaskDto from "../dtos/task/createTask.dto.js";
import UpdateTaskDto from "../dtos/task/updateTask.dto.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", validateDto(TaskFilterDto), (req, res, next) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Listar tarefas com filtros'
    #swagger.description = 'Retorna uma lista de tarefas com filtros opcionais'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'Filtros de busca',
      schema: { $ref: '#/definitions/FilterTask' }
    }
    #swagger.responses[200] = {
      description: 'Lista de tarefas'
    }
  */
  return taskController.findAll(req, res, next);
});

router.post("/", validateDto(CreateTaskDto), (req, res, next) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Criar nova tarefa'
    #swagger.description = 'Cria uma nova tarefa no sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados da nova tarefa',
      required: true,
      schema: { $ref: '#/definitions/CreateTask' }
    }
    #swagger.responses[201] = {
      description: 'Tarefa criada com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação'
    }
  */
  return taskController.create(req, res, next);
});

router.get("/:id", (req, res, next) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Buscar tarefa por ID'
    #swagger.description = 'Retorna os dados de uma tarefa específica'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da tarefa',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Tarefa encontrada'
    }
    #swagger.responses[404] = {
      description: 'Tarefa não encontrada'
    }
  */
  return taskController.findById(req, res, next);
});

router.put("/:id", validateDto(UpdateTaskDto), (req, res, next) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Atualizar tarefa'
    #swagger.description = 'Atualiza os dados de uma tarefa existente'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da tarefa',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados atualizados da tarefa',
      required: true,
      schema: { $ref: '#/definitions/UpdateTask' }
    }
    #swagger.responses[200] = {
      description: 'Tarefa atualizada com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Tarefa não encontrada'
    }
  */
  return taskController.update(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Deletar tarefa'
    #swagger.description = 'Remove uma tarefa do sistema'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID da tarefa',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Tarefa deletada com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Tarefa não encontrada'
    }
  */
  return taskController.delete(req, res, next);
});

export default router;