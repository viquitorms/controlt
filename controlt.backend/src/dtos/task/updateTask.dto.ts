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
    title: string;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description: string;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date: string;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    priority_id: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    project_id: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    assigned_to_id: number;
}