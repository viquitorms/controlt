export interface TermCreateRequest {
    name: string;
    description?: string;
}

export interface TermUpdateRequest {
    id: number;
    name?: string;
    description?: string;
}

export interface TermListFilters {
    search?: string;
}