import { Router } from 'express';
import TeamController from '../controllers/team.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas protegidas
router.use(authMiddleware);

// CRUD básico
router.post('/', TeamController.create);
router.get('/', TeamController.list);
router.get('/:id', TeamController.findById);
router.put('/:id', TeamController.update);
router.delete('/:id', TeamController.delete);

// Gestão de membros
router.get('/:id/members', TeamController.getMembers);
router.post('/:id/members', TeamController.addMember);
router.delete('/:id/members/:userId', TeamController.removeMember);

export default router;