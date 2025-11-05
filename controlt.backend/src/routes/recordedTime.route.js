import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import StartTimerDto from '../dtos/recordedTime/startTimer.dto.ts';
import FilterRecordedTimeDto from '../dtos/recordedTime/filterRecordedTime.dto.ts';
import RecordedTimeController from '../controllers/recordedTime.controller.js';

const router = Router();

router.use(authMiddleware);

router.post("/start", validateDto(StartTimerDto), (req, res, next) => {
  /* 
    #swagger.path = '/recorded-time/start'
    #swagger.tags = ['Recorded Time']
    #swagger.summary = 'Iniciar timer'
    #swagger.description = 'Inicia um novo timer de registro de tempo'
    #swagger.security = []
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados para iniciar o timer',
      required: true,
      schema: { $ref: '#/definitions/StartTimer' }
    }
    #swagger.responses[201] = {
      description: 'Timer iniciado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação ou timer já ativo',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return RecordedTimeController.start(req, res, next);
});

router.post("/stop", (req, res, next) => {
  /* 
    #swagger.path = '/recorded-time/stop'
    #swagger.tags = ['Recorded Time']
    #swagger.summary = 'Parar timer'
    #swagger.description = 'Para o timer ativo do usuário'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Timer parado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Nenhum timer ativo encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }Dto
  */
  return RecordedTimeController.stop(req, res, next);
});

router.get("/", validateDto(FilterRecordedTimeDto), (req, res, next) => {
  /* 
    #swagger.path = '/recorded-time'
    #swagger.tags = ['Recorded Time']
    #swagger.summary = 'Listar registros de tempo com filtros'
    #swagger.description = 'Retorna uma lista de registros de tempo com filtros opcionais'
    #swagger.security = []
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'Filtros de busca',
      schema: { $ref: '#/definitions/FilterRecordedTime' }
    }
    #swagger.responses[200] = {
      description: 'Lista de registros de tempo'
    }
  */
  return RecordedTimeController.findAll(req, res, next);
});

router.get("/active", (req, res, next) => {
  /* 
    #swagger.path = '/recorded-time/active'
    #swagger.tags = ['Recorded Time']
    #swagger.summary = 'Obter timer ativo'
    #swagger.description = 'Retorna o timer ativo do usuário, se existir'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Timer ativo encontrado ou null'
    }
  */
  return RecordedTimeController.getActiveTimer(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  /* 
    #swagger.path = '/recorded-time/{id}'
    #swagger.tags = ['Recorded Time']
    #swagger.summary = 'Deletar registro de tempo'
    #swagger.description = 'Remove um registro de tempo do sistema'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do registro de tempo',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Registro deletado com sucesso'
    }
    #swagger.responses[404] = {
      description: 'Registro não encontrado',
      schema: { $ref: '#/definitions/ErrorResponse' }
    }
  */
  return RecordedTimeController.delete(req, res, next);
});

export default router;