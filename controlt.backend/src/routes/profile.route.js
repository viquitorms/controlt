import Router from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import profileController from '../controllers/profile.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', profileController.list);

export default router;
