export interface CreateItemDto {
    title: string;
    note: string;
    created_by_id: number;
    is_processed: boolean;
}

export interface ItemFilterDto {
    title?: string;
    created_by_id?: number;
    created_date_from?: string;
    created_date_to?: string;
    page?: number;
    limit?: number;
    note?: string;
    is_processed?: boolean;
}

export interface UpdateItemDto {
    title?: string;
    note?: string;
    is_processed?: boolean;
}