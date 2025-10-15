export interface Profile {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    profile_id: number;
    created_date: Date;
    profile?: Profile;
}

export interface Team {
    id: number;
    name: string;
    created_date: Date;
}

export interface UserTeam {
    user_id: number;
    team_id: number;
}

export interface Project {
    id: number;
    title: string;
    description?: string;
    status: string;
    created_date: Date;
}

export interface Term {
    id: number;
    name: string;
    description?: string;
    created_date: Date;
    updated_date: Date;
}

export interface Item {
    id: number;
    title: string;
    description?: string;
    status: string;
    due_date?: Date;
    project_id?: number;
    user_id: number;
    created_date: Date;
    updated_date: Date;
    project?: Project;
    user?: User;
}

export interface RecordedTime {
    id: number;
    minutes_duration: number;
    register_date: Date;
    item_id: number;
    user_id: number;
    item?: Item;
    user?: User;
}