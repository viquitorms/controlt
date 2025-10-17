import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', itemController.create);
router.get('/', itemController.list);
router.get('/:id', itemController.findById);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

router.get('/inbox/:userId', itemController.getInbox);
router.get('/next-actions/:userId', itemController.getNextActions);
router.get('/waiting/:userId', itemController.getWaitingFor);
router.get('/scheduled/:userId', itemController.getScheduled);
router.get('/someday/:userId', itemController.getSomedayMaybe);

router.put('/:id/process', itemController.processItem);
router.put('/:id/status', itemController.updateStatus);
router.put('/:id/complete', itemController.completeItem);
router.post('/:id/convert-to-project', itemController.convertToProject);

router.get('/user/:userId', itemController.getByUser);
router.get('/project/:projectId', itemController.getByProject);

export default router;