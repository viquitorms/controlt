export interface ItemCreateRequest {
    title: string;
    description?: string;
    user_id: number;
    project_id?: number;
    due_date?: string;
    status_name?: string;
}

export interface ItemUpdateRequest {
    id: number;
    title?: string;
    description?: string;
    status_name?: string;
    due_date?: string;
    project_id?: number;
    user_id?: number;
}

export interface ItemListFilters {
    user_id?: number;
    project_id?: number;
    status_name?: string;
    search?: string;
}

export interface ItemProcessRequest {
    id: number;
    is_actionable: boolean;
    status_name?: string;
    project_id?: number;
    due_date?: string;
    user_id?: number;
}

export interface ItemUpdateStatusRequest {
    id: number;
    status_name: string;
}

export interface ItemConvertToProjectRequest {
    id: number;
    title?: string;
    description?: string;
    status?: string;
}