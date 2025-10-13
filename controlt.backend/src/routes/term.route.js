import { Router } from 'express';
import TermController from '../controllers/term.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', TermController.create);
router.get('/', TermController.list);
router.get('/search/:name', TermController.findByName);
router.get('/:id', TermController.findById);
router.put('/:id', TermController.update);
router.delete('/:id', TermController.delete);

export default router;