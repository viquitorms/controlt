import { isString } from "class-validator";

export default class CreateStatusProjectDto {
    /**
     * O nome do status. Deve ser único.
     * @type {string}
     * @example "Em Andamento"
     */
    @isString()
    name;
}