import { IsString, IsOptional } from "class-validator";

/**
 * @class UpdateItemDto
 * @description DTO para a atualização de um item existente.
 */
export default class UpdateItemDto {
    /**
     * O novo título para o item.
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title: string;

    /**
     * As novas notas para o item.
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    note: string;
}