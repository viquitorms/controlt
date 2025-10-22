import type { ItemListResponse } from '../item/Item.res.dto';

export interface RecordedTimeResponse {
    id: number;
    startedAt: string;
    endedAt: string | null;
    itemId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    item?: ItemListResponse;
}