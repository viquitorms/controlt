import { Router } from "express";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import TaskFilterDto from "../dtos/tasks/filterTask.dto.js";
import CreateTaskDto from "../dtos/tasks/createTask.dto.js";
import UpdateTaskDto from "../dtos/tasks/updateTask.dto.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", validateDto(TaskFilterDto), taskController.findAll);
router.post("/", validateDto(CreateTaskDto), taskController.create);

router.get("/:id", taskController.findById);
router.put("/:id", validateDto(UpdateTaskDto), taskController.update);
router.delete("/:id", taskController.delete);

export default router;