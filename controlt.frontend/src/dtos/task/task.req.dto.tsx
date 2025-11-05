export interface CreateTaskDto {
    item_id: number;
    title: string;
    description?: string;
    due_date?: string;
    priority_id?: number;
    project_id?: number;
    status_id: number;
    created_by_id: number;
    assigned_to_id?: number;
}

export interface TaskFilterDto {
    status_id?: number;
    priority_id?: number;
    project_id?: number;
    assigned_to_id?: number;
    due_date_from?: string;
    due_date_to?: string;
    page?: number;
    limit?: number;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    due_date?: string;
    priority_id?: number;
    project_id?: number;
    status_id?: number;
    assigned_to_id?: number;
}