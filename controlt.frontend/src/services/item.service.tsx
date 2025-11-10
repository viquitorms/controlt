import api from "../config/Axios";
import type {
    CreateItemDto,
    UpdateItemDto,
    ItemFilterDto,
} from "../dtos/item/Item.req.dto";
import type { Item } from "../dtos/item/Item.res.dto";

export const itemService = {
    async create(data: CreateItemDto): Promise<Item> {
        const response = await api.post("/items", data);
        return response.data as Item;
    },

    async findAll(filters?: ItemFilterDto): Promise<Item[]> {
        const response = await api.get("/items", {
            params: filters,
        });
        return response.data as Item[];
    },

    async findById(id: number): Promise<Item> {
        const response = await api.get(`/items/${id}`);
        return response.data as Item;
    },

    async update(id: number, data: UpdateItemDto): Promise<Item> {
        const response = await api.put(`/items/${id}`, data);
        return response.data as Item;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/items/${id}`);
    },
};