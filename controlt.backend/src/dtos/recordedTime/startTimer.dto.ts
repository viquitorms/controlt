import { Type } from "class-transformer";
import { IsInt, isInt, IsOptional } from "class-validator";
import { type } from "os";

export default class StartTimerDto {

    /**
     * ID do item associado ao tempo registrado.
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    item_id: number;

    /**
     * ID da tarefa associada ao tempo registrado.
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    task_id: number;
}