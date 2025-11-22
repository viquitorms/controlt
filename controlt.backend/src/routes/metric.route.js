import { Router } from 'express';
import metricController from '../controllers/metric.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/lead-time', metricController.getLeadTime);
router.get('/conclusion-rate', metricController.getConclusionRate);

export default router;