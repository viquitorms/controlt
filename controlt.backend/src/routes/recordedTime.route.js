import { Router } from 'express';
import recordedTimeController from '../controllers/recordedTime.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', recordedTimeController.create);
router.get('/', recordedTimeController.list);
router.get('/:id', recordedTimeController.findById);
router.put('/:id', recordedTimeController.update);
router.delete('/:id', recordedTimeController.delete);

router.get('/item/:itemId', recordedTimeController.getTimeByItem);
router.get('/user/:userId/stats', recordedTimeController.getTimeByUser);
router.get('/project/:projectId', recordedTimeController.getTimeByProject);

export default router;