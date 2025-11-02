import { IsOptional, IsInt, IsString } from "class-validator";
import { Type } from "class-transformer";

export default class FilterProjectDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit;
}