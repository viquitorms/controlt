import { IsString, IsOptional, IsInt, IsDateString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @class UpdateTaskDto
 * @description DTO para a atualização de uma tarefa existente.
 */
export default class UpdateTaskDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    priority_id;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    project_id;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    assigned_to_id;
}