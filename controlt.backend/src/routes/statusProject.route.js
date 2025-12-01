import { Router } from "express";
import statusProjectController from "../controllers/statusProject.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CreateStatusProjectDto from "../dtos/statusProject/createStatusProject.dto.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateStatusProjectDto), (req, res, next) => {
  return statusProjectController.create(req, res, next);
});

router.get("/", (req, res, next) => {
  return statusProjectController.findAll(req, res, next);
});

export default router;