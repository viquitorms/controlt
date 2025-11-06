export interface User {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        name: string;
    };
    created_date: Date;
}