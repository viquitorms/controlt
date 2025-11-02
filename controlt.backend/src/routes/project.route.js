import { Router } from "express";
import ProjectController from "../controllers/project.controller.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CreateProjectDto from "../dtos/project/createProject.dto.js";
import UpdateProjectDto from "../dtos/project/updateProject.dto.js";
import FilterProjectDto from "../dtos/project/filterProject.dto.js";
import projectController from "../controllers/project.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateProjectDto), projectController.create);
router.get("/", validateDto(FilterProjectDto), projectController.findAll);
router.get("/:id", projectController.findById);
router.put("/:id", validateDto(UpdateProjectDto), projectController.update);
router.delete("/:id", projectController.delete);

export default router;