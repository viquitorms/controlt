import { Type } from "class-transformer";
import { IsInt, isInt, IsOptional } from "class-validator";
import { type } from "os";

export default class StartTimerDto {

    /**
     * ID da tarefa associada ao tempo registrado.
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    task_id: number;
}