import { IsOptional, IsString, IsEmail, IsInt, MinLength, isString } from "class-validator";
import { Type } from "class-transformer";

export default class UpdateUserDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    profile_id: number;
}