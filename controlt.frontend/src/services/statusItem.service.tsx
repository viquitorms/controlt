import api from '../config/Axios';
import type { StatusItemResponse } from '../dtos/statusItem/StatusItem.res.dto';

export const statusItemService = {
    async list(): Promise<StatusItemResponse[]> {
        const response = await api.get('/status-item');
        return response.data;
    },
};