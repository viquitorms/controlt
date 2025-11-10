import { Router } from "express";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import TaskFilterDto from "../dtos/task/filterTask.dto.js";
import CreateTaskDto from "../dtos/task/createTask.dto.js";
import UpdateTaskDto from "../dtos/task/updateTask.dto.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", validateDto(TaskFilterDto), (req, res, next) => {
  return taskController.findAll(req, res, next);
});

router.post("/", validateDto(CreateTaskDto), (req, res, next) => {
  return taskController.create(req, res, next);
});

router.get("/:id", (req, res, next) => {
  return taskController.findById(req, res, next);
});

router.put("/:id", validateDto(UpdateTaskDto), (req, res, next) => {
  return taskController.update(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  return taskController.delete(req, res, next);
});

export default router;