import { IsOptional, IsInt, IsDateString, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @class TaskFilterDto
 * @description DTO para os parâmetros de filtro da rota de listagem de tarefas.
 */
export default class TaskFilterDto {
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
    assigned_to_id: number;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date_from: string;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date_to: string;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number;
}