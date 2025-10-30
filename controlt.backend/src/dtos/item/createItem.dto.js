import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

/**
 * @class CreateItemDto
 * @description DTO para a criação de um novo item na caixa de entrada.
 */
export default class CreateItemDto {
    /**
     * O título ou a descrição curta do item capturado.
     * @type {string}
     * @example "Ligar para o contador sobre o imposto de renda"
     */
    @IsString()
    title;

    /**
     * Notas adicionais ou detalhes sobre o item.
     * @type {string | undefined}
     * @example "Verificar o prazo final e os documentos necessários."
     */
    @IsOptional()
    @IsString()
    note;

    /**
     * O ID do usuário que criou o item.
     * @type {number}
     */
    @IsInt()
    @Type(() => Number)
    created_by_id;
}