import type { StatusProject } from "../statusProject/statusProject.res.dto";
import type { Task } from "../task/task.res.dto";

export interface Project {
    id: number;
    title: string;
    description: string | null;
    created_date: Date;
    status_id: number;
    tasks?: Task[];
    status?: StatusProject;
}