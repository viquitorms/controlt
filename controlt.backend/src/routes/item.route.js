import { Router } from 'express';
import ItemController from '../controllers/item.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', ItemController.create);
router.get('/', ItemController.list);
router.get('/:id', ItemController.findById);
router.put('/:id', ItemController.update);
router.delete('/:id', ItemController.delete);

router.get('/inbox/:userId', ItemController.getInbox);
router.get('/next-actions/:userId', ItemController.getNextActions);
router.get('/waiting/:userId', ItemController.getWaitingFor);
router.get('/scheduled/:userId', ItemController.getScheduled);
router.get('/someday/:userId', ItemController.getSomedayMaybe);

router.put('/:id/process', ItemController.processItem);
router.put('/:id/status', ItemController.updateStatus);
router.put('/:id/complete', ItemController.completeItem);
router.post('/:id/convert-to-project', ItemController.convertToProject);

router.get('/user/:userId', ItemController.getByUser);
router.get('/project/:projectId', ItemController.getByProject);

export default router;