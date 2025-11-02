import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import CreateStatusTaskDto from "../dtos/statusTask/createStatusTask.dto";
import statusTaskController from "../controllers/statusTask.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateStatusTaskDto), statusTaskController.create);
router.get("/", statusTaskController.findAll);

export default router;