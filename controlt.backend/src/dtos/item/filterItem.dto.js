import { IsOptional, IsInt, IsDateString, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @class ItemFilterDto
 * @description DTO para os parâmetros de filtro da rota de listagem de itens.
 */
export default class ItemFilterDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    created_by_id;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    created_date_from;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    created_date_to;

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