export interface ProjectCreateRequest {
    title: string;
    description?: string;
    status: string;
}

export interface ProjectUpdateRequest {
    id: number;
    title?: string;
    description?: string;
    status?: string;
}