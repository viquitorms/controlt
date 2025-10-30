import { IsString, IsOptional, IsInt, IsDateString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @class CreateTaskDto
 * @description DTO para a criação de uma nova tarefa acionável.
 */
export default class CreateTaskDto {
    /**
     * O ID do Item de origem que gerou esta tarefa.
     * @type {number}
     */
    @IsInt()
    @Type(() => Number)
    item_id;

    /**
     * O título da tarefa. Pode ser o mesmo do item ou um mais específico.
     * @type {string}
     */
    @IsString()
    title;

    /**
     * Descrição detalhada da tarefa.
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description;

    /**
     * Data de vencimento da tarefa.
     * @type {string | undefined}
     * @example "2025-12-31T23:59:59.000Z"
     */
    @IsOptional()
    @IsDateString()
    due_date;

    /**
     * ID da prioridade da tarefa (ex: 1=Baixa, 3=Alta).
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    priority_id;

    /**
     * ID do projeto ao qual a tarefa pertence.
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    project_id;

    /**
     * ID do status inicial da tarefa (ex: 1="To Do").
     * @type {number}
     */
    @IsInt()
    @Type(() => Number)
    status_id;

    /**
     * ID do usuário que criou a tarefa.
     * @type {number}
     */
    @IsInt()
    @Type(() => Number)
    created_by_id;

    /**
     * ID do usuário a quem a tarefa foi atribuída.
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    assigned_to_id;
}