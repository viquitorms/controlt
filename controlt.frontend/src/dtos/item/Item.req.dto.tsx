import type { Project } from "../Project.entity";
import type { User } from "../user/User.res.dto";

export interface Item {
    id: number;
    title: string;
    description: string;
    status: string;
    due_date: Date;
    project_id: number;
    context_id: number;
    user_id: number;

    user?: User;
    project?: Project;
}