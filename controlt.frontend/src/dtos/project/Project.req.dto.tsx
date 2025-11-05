export interface CreateProjectDto {
    title: string;
    description?: string;
    status_id: number;
}

export interface FilterProjectDto {
    title?: string;
    status_id?: number;
    page?: number;
    limit?: number;
}

export interface UpdateProjectDto {
    title?: string;
    status_id?: number;
    page?: number;
}