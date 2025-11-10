import { IsOptional, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export default class TaskFilterDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    status_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    priority_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    project_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    assigned_to_id?: number;

    @IsOptional()
    @IsDateString()
    due_date_from?: string;

    @IsOptional()
    @IsDateString()
    due_date_to?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number;
}