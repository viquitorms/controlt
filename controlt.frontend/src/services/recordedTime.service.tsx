import api from "../config/Axios";
import type {
    StartTimerDto,
    FilterRecordedTimeDto,
} from "../dtos/recordedTime/RecordeTime.req.dto.tsx";
import type { RecordedTime } from "../dtos/recordedTime/RecordedTime.res.dto";

export const recordedTimeService = {
    async start(data: StartTimerDto): Promise<RecordedTime> {
        const response = await api.post("/recorded-time/start", data);
        return response.data as RecordedTime;
    },

    async stop(): Promise<RecordedTime> {
        const response = await api.post("/recorded-time/stop");
        return response.data as RecordedTime;
    },

    async findAll(filters?: FilterRecordedTimeDto): Promise<RecordedTime[]> {
        const response = await api.get("/recorded-time", {
            params: filters,
        });
        return response.data as RecordedTime[];
    },

    async getActiveTimer(): Promise<RecordedTime | null> {
        const response = await api.get("/recorded-time/active");
        return response.data as RecordedTime | null;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/recorded-time/${id}`);
    },
};