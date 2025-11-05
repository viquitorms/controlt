export interface Project {
    id: number;
    title: string;
    description: string | null;
    created_date: Date;
    status_id: number;
}