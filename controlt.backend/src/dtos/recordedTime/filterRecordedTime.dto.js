import { IsDateString, isInt, IsOptional } from "class-validator";

export default class FilterRecordedTimeDto {

    @IsOptional()
    @isInt()
    @type(() => Number)
    user_id;

    @IsOptional()
    @isInt()
    @type(() => Number)
    item_id;

    @IsOptional()
    @isInt()
    @type(() => Number)
    task_id;

    @IsOptional()
    @IsDateString()
    date_from;

    @IsOptional()
    @IsDateString()
    date_to;

    @IsOptional()
    @isInt()
    @type(() => Number)
    page;

    @IsOptional()
    @isInt()
    @type(() => Number)
    limit;
}