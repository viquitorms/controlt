import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import profileController from '../controllers/profile.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  return profileController.list(req, res, next);
});

export default router;