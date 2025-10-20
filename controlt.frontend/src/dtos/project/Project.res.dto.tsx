export interface ProjectListResponse {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_date: Date;
}

export interface ProjectFindByIdResponse {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_date: Date;
}

export interface ProjectCreateResponse {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_date: Date;
}

export interface ProjectUpdateResponse {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_date: Date;
}