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
    status_id;

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
    assigned_to_id;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date_from;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    due_date_to;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit;
}