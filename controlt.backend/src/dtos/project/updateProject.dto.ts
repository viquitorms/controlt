import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export default class UpdateProjectDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title: string;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description: string;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id: number;
}