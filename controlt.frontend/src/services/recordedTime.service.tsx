// controlt.frontend/src/services/recordedTime.service.tsx
import api from '../config/Axios';
import type { IStartTrackingRequest, IStopTrackingRequest } from '../dtos/recordedTime/RecordeTime.req.dto';
import type { RecordedTimeResponse } from '../dtos/recordedTime/RecordedTime.res.dto';

export const recordedTimeService = {
    async startTracking(id: number): Promise<RecordedTimeResponse> {
        const data: IStartTrackingRequest = { id: id };
        const response = await api.post<RecordedTimeResponse>('/recorded-time/start', data);
        return response.data;
    },

    async stopTracking(id: number): Promise<RecordedTimeResponse> {
        const data: IStopTrackingRequest = { id: id };
        const response = await api.post<RecordedTimeResponse>('/recorded-time/stop', data);
        return response.data;
    },

    async getActiveTracking(): Promise<RecordedTimeResponse | null> {
        const response = await api.get<RecordedTimeResponse | null>('/recorded-time/active');
        return response.data;
    }
}

