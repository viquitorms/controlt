import { isInt, IsString } from "class-validator";

export default class CreatePriorityTaskDto {

    /**
     * O nível de prioridade da tarefa.
     */
    @isInt()
    @type(() => Number)
    level;

    /**
     * O nome da prioridade da tarefa.
     */
    @IsString()
    name;
}