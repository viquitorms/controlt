import { Type } from "class-transformer";
import { IsDateString, IsInt, isInt, IsOptional } from "class-validator";

export default class FilterRecordedTimeDto {

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    user_id: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    item_id: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    task_id: number;

    @IsOptional()
    @IsDateString()
    date_from: string;

    @IsOptional()
    @IsDateString()
    date_to: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number;
}