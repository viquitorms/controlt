import type { PriorityTask } from "../priorityTask/priorityTask.res.dto";
import type { Project } from "../project/Project.res.dto";
import type { RecordedTime } from "../recordedTime/RecordedTime.res.dto";
import type { StatusTask } from "../statusTask/statusTask.res.dto";
import type { User } from "../user/User.res.dto";

export interface MetricData {
    id: number;
    title: string;
    project: string;
    capture_date: string;
    completion_date: string;
    lead_time_days: number;
    lead_time_formatted: string;
}

export interface MetricSummary {
    average_days: number;
    total_tasks: number;
    average_formatted: string;
}

export interface LeadTimeMetricResponse {
    metric: string;
    description: string;
    summary: MetricSummary;
    data: MetricData[];
}

export interface ConclusionRateData {
    id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    completed_at: Date | null;
    created_date: Date;
    priority: PriorityTask | null;
    project: Project | null;
    status: StatusTask;
    created_by: User;
    assigned_to: User | null;
    recorded_time: RecordedTime[];
}

export interface ConclusionRateSummary {
    rate: number;
    total_planned: number;
    total_completed: number;
}

export interface ConclusionRateResponse {
    summary: ConclusionRateSummary;
    data: ConclusionRateData[];
}