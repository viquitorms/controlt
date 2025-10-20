import { Router } from 'express';
import termController from '../controllers/term.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', termController.create);
router.get('/', termController.list);
router.get('/search/:name', termController.findByName);
router.get('/:id', termController.findById);
router.put('/:id', termController.update);
router.delete('/:id', termController.delete);

export default router;