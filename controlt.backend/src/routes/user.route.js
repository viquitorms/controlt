import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateUserDto from '../dtos/user/createUser.dto.js';
import UpdateUserDto from '../dtos/user/updateUser.dto.js';

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateUserDto), (req, res, next) => {
  return userController.create(req, res, next);
});

router.put("/:id", validateDto(UpdateUserDto), (req, res, next) => {
  return userController.update(req, res, next);
});

router.get("/", (req, res, next) => {
  return userController.findAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  return userController.findById(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  return userController.delete(req, res, next);
});

export default router;