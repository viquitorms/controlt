import { Router } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import projectRoutes from "./project.route.js";
import taskRoutes from "./task.route.js";
import teamRoutes from "./team.route.js";
import termRoutes from "./term.route.js";
import recordedTimeRoutes from "./recordedTime.route.js";
import itemRoutes from "./item.route.js";
import profileRoutes from "./profile.route.js";
import priorityTaskRoutes from "./priorityTask.route.js";
import statusProjectRoutes from "./statusProject.route.js";
import statusTaskRoutes from "./statusTask.route.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/items', itemRoutes);
router.use('/teams', teamRoutes);
router.use('/terms', termRoutes);
router.use('/profiles', profileRoutes);
router.use('/priority-tasks', priorityTaskRoutes);
router.use('/status-projects', statusProjectRoutes);
router.use('/status-tasks', statusTaskRoutes);
router.use('/recorded-time', recordedTimeRoutes);

export default router;