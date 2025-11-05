export interface Task {
    id: number;
    title: string;
    description: string | null;
    status_id: number;
    created_date: Date;
    item_id: number;
    created_by_id: number;
    due_date: Date | null;
    priority_id: number | null;
    project_id: number | null;
    started_at: Date | null;
    completed_at: Date | null;
    assigned_to_id: number | null;
}