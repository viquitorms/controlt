export interface ItemUser {
    id: number;
    name: string;
    email?: string;
}

export interface ItemProject {
    id: number;
    title: string;
    description?: string;
}

export interface ItemStatus {
    id: number;
    name: string;
    color: string;
}

export interface ItemRecordedTime {
    id: number;
    minutes_duration: number;
    register_date: Date;
    user: {
        id: number;
        name: string;
    };
}

export interface ItemCreateResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
}

export interface ItemListResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
    _count: {
        recorded_time: number;
    };
}

export interface ItemFindByIdResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
    recorded_time: ItemRecordedTime[];
    total_time_minutes: number;
    total_time_hours: string;
}

export interface ItemUpdateResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
}

export interface ItemInboxResponse {
    count: number;
    items: Array<{
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject | null;
        status: ItemStatus;
    }>;
}

export interface ItemProcessResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
}

export interface ItemUpdateStatusResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
}

export interface ItemCompleteResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    project: ItemProject | null;
    status: ItemStatus;
}

export interface ItemNextActionsResponse {
    count: number;
    items: Array<{
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject | null;
        status: ItemStatus;
    }>;
}

export interface ItemWaitingForResponse {
    count: number;
    items: Array<{
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject | null;
        status: ItemStatus;
    }>;
}

export interface ItemScheduledResponse {
    count: number;
    items: Array<{
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject | null;
        status: ItemStatus;
    }>;
}

export interface ItemSomedayMaybeResponse {
    count: number;
    items: Array<{
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject | null;
        status: ItemStatus;
    }>;
}

export interface ItemByUserResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    project: ItemProject | null;
    status: ItemStatus;
    _count: {
        recorded_time: number;
    };
}

export interface ItemByProjectResponse {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    project_id: number | null;
    user_id: number;
    status_id: number;
    created_date: Date;
    updated_date: Date;
    user: ItemUser;
    status: ItemStatus;
    _count: {
        recorded_time: number;
    };
}

export interface ItemConvertToProjectResponse {
    project: {
        id: number;
        title: string;
        description: string | null;
        status: string;
        created_date: Date;
    };
    item: {
        id: number;
        title: string;
        description: string | null;
        due_date: Date | null;
        project_id: number | null;
        user_id: number;
        status_id: number;
        created_date: Date;
        updated_date: Date;
        project: ItemProject;
        user: ItemUser;
        status: ItemStatus;
    };
    message: string;
} 