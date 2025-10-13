import { Router } from 'express';
import RecordedTimeController from '../controllers/recordedTime.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', RecordedTimeController.create);
router.get('/', RecordedTimeController.list);
router.get('/:id', RecordedTimeController.findById);
router.put('/:id', RecordedTimeController.update);
router.delete('/:id', RecordedTimeController.delete);

router.get('/item/:itemId', RecordedTimeController.getTimeByItem);
router.get('/user/:userId/stats', RecordedTimeController.getTimeByUser);
router.get('/project/:projectId', RecordedTimeController.getTimeByProject);

export default router;