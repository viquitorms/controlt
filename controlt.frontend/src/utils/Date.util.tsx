import { dayjs } from '../config/Dayjs.config';
import type { Dayjs } from 'dayjs';

// Formatos padrão centralizados (não precisa passar pela app)
const DEFAULT_DATE_FORMAT = 'L';   // ex.: 31/12/2025 (localizedFormat)
const DEFAULT_DATE_TIME_FORMAT = 'LLL'; // ex.: 31 de dezembro de 2025 14:30

export function formatDate(value?: string | Date | Dayjs | null): string {
    if (!value) return '';
    const d = dayjs.isDayjs(value) ? value : dayjs(value);
    return d.isValid() ? d.format(DEFAULT_DATE_FORMAT) : '';
}

export function formatDateTime(value?: string | Date | Dayjs | null): string {
    if (!value) return '';
    const d = dayjs.isDayjs(value) ? value : dayjs(value);
    return d.isValid() ? d.format(DEFAULT_DATE_TIME_FORMAT) : '';
}

// Quando precisar salvar para backend (UTC/ISO):
export function toISO(value?: string | Date | Dayjs | null): string | undefined {
    if (!value) return undefined;
    const d = dayjs.isDayjs(value) ? value : dayjs(value);
    return d.isValid() ? d.utc().toISOString() : undefined;
}

export { dayjs };
export type { Dayjs };