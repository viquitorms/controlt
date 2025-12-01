import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import StartTimerDto from '../dtos/recordedTime/startTimer.dto.js';
import FilterRecordedTimeDto from '../dtos/recordedTime/filterRecordedTime.dto.js';
import RecordedTimeController from '../controllers/recordedTime.controller.js';

const router = Router();

router.use(authMiddleware);

router.post("/start", validateDto(StartTimerDto), (req, res, next) => {
  return RecordedTimeController.start(req, res, next);
});

router.post("/stop", (req, res, next) => {
  return RecordedTimeController.stop(req, res, next);
});

router.get("/", validateDto(FilterRecordedTimeDto), (req, res, next) => {
  return RecordedTimeController.findAll(req, res, next);
});

router.get("/active", (req, res, next) => {
  return RecordedTimeController.getActiveTimer(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  return RecordedTimeController.delete(req, res, next);
});

export default router;