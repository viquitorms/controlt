export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    profile_id: number;
}

export interface UpdateUserDto {
    name: string;
    email?: string;
    password?: string;
    profile_id?: number;
}