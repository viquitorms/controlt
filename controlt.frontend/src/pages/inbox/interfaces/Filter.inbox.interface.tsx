import type { Dayjs } from "dayjs";

export interface IFilter {
    title: string;
    description: string;
    captured_date: Dayjs | null;
}