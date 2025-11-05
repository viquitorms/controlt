export interface Item {
    id: number;
    title: string;
    created_date: Date;
    created_by_id: number;
    note: string | null;
    is_processed: boolean;
}