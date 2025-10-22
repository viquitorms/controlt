// SUBSTITUIR O CONTEÚDO INTEIRO DESTE ARQUIVO

import { Router } from 'express';
import recordedTimeController from '../controllers/recordedTime.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// Rotas de tracking (sem o prefixo /recorded-time)
router.post('/start', recordedTimeController.startTracking);
router.post('/stop', recordedTimeController.stopTracking);
router.get('/active', recordedTimeController.getActiveTracking);

// Rotas genéricas (sem o prefixo /recorded-time)
// O prefixo /recorded-time já foi definido no index.route.js
router.get('/', recordedTimeController.findAll);
router.post('/', recordedTimeController.create);
router.put('/:id', recordedTimeController.update);
router.delete('/:id', recordedTimeController.remove);

export default router;