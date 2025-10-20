export interface TermListResponse {
    id: number;
    name: string;
    description: string | null;
    created_date: Date;
    updated_date: Date;
}

export interface TermFindByIdResponse {
    id: number;
    name: string;
    description: string | null;
    created_date: Date;
    updated_date: Date;
}

export interface TermFindByNameResponse {
    id: number;
    name: string;
    description: string | null;
    created_date: Date;
    updated_date: Date;
}

export interface TermCreateResponse {
    id: number;
    name: string;
    description: string | null;
    created_date: Date;
    updated_date: Date;
}

export interface TermUpdateResponse {
    id: number;
    name: string;
    description: string | null;
    created_date: Date;
    updated_date: Date;
}