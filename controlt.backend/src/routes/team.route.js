import { Router } from 'express';
import teamController from '../controllers/team.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas protegidas
router.use(authMiddleware);

// CRUD básico
router.post('/', teamController.create);
router.get('/', teamController.list);
router.get('/:id', teamController.findById);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.delete);

// Gestão de membros
router.get('/:id/members', teamController.getMembers);
router.post('/:id/members', teamController.addMember);
router.delete('/:id/members/:userId', teamController.removeMember);

export default router;