import { Router } from "express";
import priorityTaskController from "../controllers/priorityTask.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import CreatePriorityTaskDto from "../dtos/priorityTask/createPriorityTask.dto.ts";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreatePriorityTaskDto), (req, res, next) => {
  return priorityTaskController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  return priorityTaskController.findAll(req, res, next);
});

export default router;