import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import StartTimerDto from '../dtos/recordedTime/startTimer.dto.js';
import FilterRecordedTimeDto from '../dtos/recordedTime/filterRecordedTime.dto.js';
import recordedTimeController from '../controllers/recordedTime.controller.js';

const router = Router();

router.use(authMiddleware);

router.post("/start", validateDto(StartTimerDto), recordedTimeController.startTracking);
router.post("/stop", recordedTimeController.stopTracking);

router.get("/", validateDto(FilterRecordedTimeDto), recordedTimeController.findAll);
router.get("/active", recordedTimeController.getActiveTracking);
router.delete("/:id", recordedTimeController.deleteTracking);

export default router;