export interface ItemCreateRequest {
    title: string;
    description?: string;
    user_id: number;
    userAssigned_id?: number;
    project_id?: number;
    due_date?: Date;
    status_name?: string;
}

export interface ItemUpdateRequest {
    id: number;
    title?: string;
    description?: string;
    status_id?: number;
    priority: number;
    due_date?: string;
    project_id?: number;
    user_id?: number;
    userAssigned_id?: number;
}

export interface ItemListFilters {
    user_id?: number;
    userAssigned_id?: number;
    project_id?: number;
    status_id?: number;
    search?: string;
}

export interface ItemProcessRequest {
    id: number;
    is_actionable: boolean;
    status_id: number;
    project_id?: number;
    due_date?: string;
    user_id?: number;
    userAssigned_id?: number;
    priority?: number;
}

export interface ItemUpdateStatusRequest {
    id: number;
    status_id: number;
}

export interface ItemConvertToProjectRequest {
    id: number;
    title?: string;
    description?: string | null;
    status?: string;
}