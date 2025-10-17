export interface AuthUser {
    id: number;
    name: string;
    email: string;
    profile: {
        id: number;
        name: string;
    };
}