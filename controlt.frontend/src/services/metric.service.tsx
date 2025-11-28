import api from "../config/Axios";
import type { LeadTimeMetricResponse, ConclusionRateResponse } from "../dtos/metric/metric.res.dto";

export interface MetricFilters {
    date_from?: string;
    date_to?: string;
    project_id?: number;
}

export const metricService = {
    /**
     * Busca a métrica de Lead Time
     * Endpoint: GET /metrics/lead-time
     */
    async getLeadTime(filters?: MetricFilters): Promise<LeadTimeMetricResponse> {
        const response = await api.get("/metrics/lead-time", {
            params: filters
        });
        return response.data as LeadTimeMetricResponse;
    },

    /**
     * 
     * @param filters 
     * @returns 
     */
    async getConclusionRate(filters?: MetricFilters): Promise<ConclusionRateResponse> {
        const response = await api.get("/metrics/conclusion-rate", {
            params: filters
        });
        return response.data as ConclusionRateResponse;
    }
};