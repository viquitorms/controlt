import type { User } from "../user/User.res.dto";

export interface RecordedTime {
    id: number;
    startedAt: Date;
    endedAt: Date | null;
    item_id: number | null;
    task_id: number | null;
    user: User;
}