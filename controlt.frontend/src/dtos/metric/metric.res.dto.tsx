export interface MetricData {
    id: number;
    title: string;
    project: string;
    capture_date: string;
    completion_date: string;
    lead_time_days: number;
}

export interface MetricSummary {
    average: number;
    total_tasks: number;
}

export interface LeadTimeMetricResponse {
    metric: string;
    unit: string;
    description: string;
    summary: MetricSummary;
    data: MetricData[];
}

export interface ConclusionRateData {
    id: number;
    title: string;
    project: string;
    due_date: string;
    status: string;
    is_completed: boolean;
}

export interface ConclusionRateSummary {
    rate: number;
    total_planned: number;
    total_completed: number;
}

export interface ConclusionRateResponse {
    metric: string;
    unit: string;
    description: string;
    summary: ConclusionRateSummary;
    data: ConclusionRateData[];
}