import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateDto } from '../middlewares/validateDto.middleware.js';
import CreateItemDto from '../dtos/item/createItem.dto.ts';
import FilterItemDto from '../dtos/item/filterItem.dto.ts';
import UpdateItemDto from '../dtos/item/updateItem.dto.ts';

const router = Router();

router.use(authMiddleware);

router.post('/', validateDto(CreateItemDto), (req, res, next) => {
  return itemController.create(req, res, next);
});

router.get('/', validateDto(FilterItemDto), (req, res, next) => {
  return itemController.findAll(req, res, next);
});

router.get('/:id', (req, res, next) => {
  return itemController.findById(req, res, next);
});

router.put('/:id', validateDto(UpdateItemDto), (req, res, next) => {
  return itemController.update(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  return itemController.delete(req, res, next);
});

export default router;