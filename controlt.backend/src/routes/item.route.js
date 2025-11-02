import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateItemDto from '../dtos/item/createItem.dto.js';
import FilterItemDto from '../dtos/item/filterItem.dto.js';
import UpdateItemDto from '../dtos/item/updateItem.dto.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validateDto(CreateItemDto), itemController.create);
router.get('/', validateDto(FilterItemDto), itemController.findAll);
router.get('/:id', itemController.findById);
router.put('/:id', validateDto(UpdateItemDto), itemController.update);
router.delete('/:id', itemController.delete);

export default router;