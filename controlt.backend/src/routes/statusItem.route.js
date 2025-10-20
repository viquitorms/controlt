import Router from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import statusItemController from '../controllers/statusItem.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', statusItemController.list);

export default router;
