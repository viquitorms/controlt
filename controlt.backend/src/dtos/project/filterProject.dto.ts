import { IsOptional, IsInt, IsString } from "class-validator";
import { Type } from "class-transformer";

export default class FilterProjectDto {
    /**
     * @type {string | undefined}
     */
    @IsOptional()
    @IsString()
    title: string;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    status_id: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number;

    /**
     * @type {number | undefined}
     */
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number;
}