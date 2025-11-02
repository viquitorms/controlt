import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export default class UpdateProjectDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title;

    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    description;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id;
}