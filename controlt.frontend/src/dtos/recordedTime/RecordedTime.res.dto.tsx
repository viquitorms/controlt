export interface RecordedTime {
    id: number;
    startedAt: Date;
    endedAt: Date | null;
    item_id: number | null;
    task_id: number | null;
    user_id: number;
}