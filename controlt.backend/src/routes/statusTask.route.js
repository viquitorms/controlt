import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import CreateStatusTaskDto from "../dtos/statusTask/createStatusTask.dto.ts";
import statusTaskController from "../controllers/statusTask.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateStatusTaskDto), (req, res, next) => {
  return statusTaskController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  return statusTaskController.findAll(req, res, next);
});

export default router;