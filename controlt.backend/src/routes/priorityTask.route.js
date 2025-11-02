import { Router } from "express";
import priorityTaskController from "../controllers/priorityTask.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import CreatePriorityTaskDto from "../dtos/priorityTask/createPriorityTask.dto.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreatePriorityTaskDto), priorityTaskController.create);
router.get("/", priorityTaskController.findAll);

export default router;