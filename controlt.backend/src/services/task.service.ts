import prisma from '../config/prisma.config.js'; // Ajuste a extensão se o config virar .ts
import { Item, Prisma, Task } from '@prisma/client';
import CreateItemDto from '../dtos/item/createItem.dto.js';
import ItemFilterDto from '../dtos/item/filterItem.dto.js';
import UpdateItemDto from '../dtos/item/updateItem.dto.js';
import CreateTaskDto from '../dtos/tasks/createTask.dto.js';

class TaskService {
    public async create(data: CreateTaskDto): Promise<Task> {

        const userExists = await prisma.user.findUnique({ where: { id: data.created_by_id } });

        if (!userExists) {
            throw new Error('Usuário criador não encontrado.');
        }

        return prisma.task.create({
            data: {
                item_id: data.item_id,
                title: data.title,
                description: data.description,
                due_date: data.due_date,
                priority_id: data.priority_id,
                project_id: data.project_id,
                status_id: data.status_id,
                created_by_id: data.created_by_id,
                assigned_to_id: data.assigned_to_id,
            },
        });
    }

    public async findAll(filters: ItemFilterDto): Promise<Item[]> {
        const { title, created_by_id, created_date_from, created_date_to, page = 1, limit = 10 } = filters;

        const where: Prisma.ItemWhereInput = {
            ...(created_by_id && { created_by_id: Number(created_by_id) }),
            ...(title && { title: { contains: title, mode: 'insensitive' } }),
            ...(created_date_from && { created_date: { gte: new Date(created_date_from) } }),
            ...(created_date_to && { created_date: { lte: new Date(created_date_to) } }),
        };

        return prisma.item.findMany({
            where,
            include: {
                created_by: { select: { id: true, name: true } },
                _count: { select: { tasks: true } },
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { created_date: 'desc' },
        });
    }

    public async findById(id: number): Promise<Item> {
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                created_by: { select: { id: true, name: true } },
                tasks: true,
                recorded_time: true,
            },
        });

        if (!item) {
            throw new Error('Item não encontrado');
        }
        return item;
    }

    public async update(id: number, data: UpdateItemDto): Promise<Item> {
        await this.findById(id);
        return prisma.item.update({
            where: { id },
            data,
        });
    }

    public async delete(id: number): Promise<void> {
        await prisma.item.delete({ where: { id } });
    }
}

export default new TaskService();