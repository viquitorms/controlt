export interface UserCreateRequest {
    name: string,
    email: string,
    password: string,
    profile_id: number
}

export interface UserUpdateRequest {
    id: number,
    name: string,
    email: string,
    profile_id: number
}