import type { PriorityTask } from "../priorityTask/priorityTask.res.dto";
import type { Project } from "../Project.entity";
import type { StatusTask } from "../statusTask/statusTask.res.dto";
import type { User } from "../user/User.res.dto";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status_id: number;
    created_date: Date;
    item_id: number;
    created_by_id: number;
    due_date: Date | null;
    priority_id: number | null;
    project_id: number | null;
    started_at: Date | null;
    completed_at: Date | null;
    assigned_to_id: number | null;
    status: StatusTask | null,
    priority: PriorityTask,
    assigned_to: User | null,
    created_by: User | null,
    project: Project | null,
}