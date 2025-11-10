export interface StartTimerDto {
    item_id?: number;
    task_id?: number;
}

export interface FilterRecordedTimeDto {
    user_id?: number;
    item_id?: number;
    task_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
}