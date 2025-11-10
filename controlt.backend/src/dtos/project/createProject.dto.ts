import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export default class CreateProjectDto {
    /**
     * O título ou nome do projeto.
     * @type {string}
     * @example "Lançamento do App ControlT V2"
     */
    @IsString()
    title: string;

    /**
     * Uma descrição mais detalhada do objetivo do projeto.
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description: string;

    /**
     * O ID do status inicial do projeto (ex: 1="Planejamento").
     * @type {number}
     */
    @IsInt()
    @Type(() => Number)
    status_id: number;
}