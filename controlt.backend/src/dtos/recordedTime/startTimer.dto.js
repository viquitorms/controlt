import { isInt, IsOptional } from "class-validator";
import { type } from "os";

export default class StartTimerDto {

    /**
     * ID do item associado ao tempo registrado.
     */
    @IsOptional()
    @isInt()
    @type(() => Number)
    item_id;

    /**
     * ID da tarefa associada ao tempo registrado.
     */
    @IsOptional()
    @isInt()
    @type(() => Number)
    task_id;
}