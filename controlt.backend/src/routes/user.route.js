import Router from 'express';
import userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateUserDto from '../dtos/user/createUser.dto.js';
import { validate } from 'class-validator';
import UpdateUserDto from '../dtos/user/updateUser.dto.js';

const router = Router();

router.use(authMiddleware);

router.post("/", validateDto(CreateUserDto), userController.create);
router.put("/:id", validateDto(UpdateUserDto), userController.update);

router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.delete("/:id", userController.delete);

export default router;
