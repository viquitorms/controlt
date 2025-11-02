import { IsOptional, IsString, IsEmail, IsInt, MinLength, isString } from "class-validator";
import { Type } from "class-transformer";

export default class UpdateUserDto {
    @isString()
    name;

    @IsOptional()
    @IsEmail()
    email;

    @IsOptional()
    @isString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    profile_id;
}