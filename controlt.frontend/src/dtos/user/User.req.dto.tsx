export interface UserCreateResponse {
    id: number,
    name: string,
    email: string,
    profile_id: number
}

export interface UserUpdateRequest {
    name: string,
    email: string,
    profile_id: number
}