import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import LoginDto from '../dtos/auth/login.dto.js';

const router = Router();

router.post('/login', validateDto(LoginDto), (req, res, next) => {
  return AuthController.login(req, res, next);
});

export default router;