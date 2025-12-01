import { IsBoolean, IsString } from "class-validator";

export default class CreateStatusTaskDto {
    /**
     * O nome do status. Deve ser único.
     * @type {string}
     * @example "In Progress"
     */
    @IsString()
    name!: string;

    @IsBoolean()
    is_actionable!: boolean;
}