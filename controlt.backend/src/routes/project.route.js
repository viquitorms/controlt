import { Router } from "express";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CreateProjectDto from "../dtos/project/createProject.dto.js";
import UpdateProjectDto from "../dtos/project/updateProject.dto.js";
import FilterProjectDto from "../dtos/project/filterProject.dto.js";
import projectController from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateProjectDto), (req, res, next) => {
  return projectController.create(req, res, next);
});

router.get("/", validateDto(FilterProjectDto), (req, res, next) => {
  return projectController.findAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  return projectController.findById(req, res, next);
});

router.put("/:id", validateDto(UpdateProjectDto), (req, res, next) => {
  return projectController.update(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  return projectController.delete(req, res, next);
});

export default router;