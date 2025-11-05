import { IsOptional, IsInt, IsDateString, IsString, IsBoolean } from "class-validator";
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
    title: string;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    created_by_id: number;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    created_date_from: string;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsDateString()
    created_date_to: string;

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

    /**
    * @type {string | undefined}
    */
    @IsOptional()
    @IsString()
    note: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_processed: boolean;
}