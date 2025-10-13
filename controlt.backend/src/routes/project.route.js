import { Router } from 'express';
import ProjectController from '../controllers/project.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', ProjectController.create);
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.findById);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);

export default router;