import { Type } from "class-transformer";
import { IsInt, isInt, IsString } from "class-validator";

export default class CreatePriorityTaskDto {

    /**
     * O nível de prioridade da tarefa.
     */
    @IsInt()
    @Type(() => Number)
    level: number;

    /**
     * O nome da prioridade da tarefa.
     */
    @IsString()
    name: string;
}