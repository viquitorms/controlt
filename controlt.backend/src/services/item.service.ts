import prisma from '../config/prisma.config.js'; // Ajuste a extensão se o config virar .ts
import { Item, Prisma } from '@prisma/client';
import CreateItemDto from '../dtos/item/createItem.dto.js';
import ItemFilterDto from '../dtos/item/filterItem.dto.js';
import UpdateItemDto from '../dtos/item/updateItem.dto.js';

class ItemService {
    public async create(data: CreateItemDto): Promise<Item> {

        const userExists = await prisma.user.findUnique({ where: { id: data.created_by_id } });
        if (!userExists) {
            throw new Error('Usuário criador não encontrado.');
        }

        return prisma.item.create({
            data: {
                title: data.title,
                note: data.note,
                created_by_id: data.created_by_id,
                is_processed: data.is_processed,
            },
        });
    }

    public async findAll(filters: ItemFilterDto): Promise<Item[]> {
        const page = Number(filters.page || 1);
        const limit = Number(filters.limit || 10);

        const where: Prisma.ItemWhereInput = {
            ...(filters.created_by_id && { created_by_id: Number(filters.created_by_id) }),
            ...(filters.title && { title: { contains: filters.title, mode: 'insensitive' } }),
            ...(filters.created_date_from && { created_date: { gte: new Date(filters.created_date_from) } }),
            ...(filters.created_date_to && { created_date: { lte: new Date(filters.created_date_to) } }),
            ...(filters.note && { note: { contains: filters.note, mode: 'insensitive' } }),
            ...(filters.is_processed !== undefined && { is_processed: String(filters.is_processed) === 'true' }),
        };

        return prisma.item.findMany({
            where,
            include: {
                created_by: { select: { id: true, name: true } },
                _count: { select: { tasks: true } },
            },
            skip: (page - 1) * limit,
            take: limit,
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

export default new ItemService();