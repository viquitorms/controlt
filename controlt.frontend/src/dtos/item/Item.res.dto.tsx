import type { RecordedTime } from "../recordedTime/RecordedTime.res.dto";
import type { Task } from "../task/task.res.dto";
import type { User } from "../user/User.res.dto";

export interface Item {
    id: number;
    title: string;
    created_date: Date;
    created_by_id: number;
    note: string | null;
    is_processed: boolean;
    created_by: User;
    tasks: Task[];
    recorded_time: RecordedTime[];
}