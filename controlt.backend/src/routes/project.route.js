import { Router } from 'express';
import projectController from '../controllers/project.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', projectController.create);
router.get('/', projectController.list);
router.get('/:id', projectController.findById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;