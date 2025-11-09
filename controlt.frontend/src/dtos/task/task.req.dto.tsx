export interface CreateTaskDto {
    item_id: number;
    title: string;
    description?: string;
    due_date?: Date;
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
    due_date_from?: Date;
    due_date_to?: Date;
    page?: number;
    limit?: number;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    due_date?: Date;
    priority_id?: number;
    project_id?: number;
    status_id?: number;
    assigned_to_id?: number;
}