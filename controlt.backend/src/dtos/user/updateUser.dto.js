import { IsOptional, IsString, IsEmail, IsInt, MinLength } from "class-validator";
import { Type } from "class-transformer";

export default class UpdateUserDto {
    @IsOptional()
    @IsString()
    name;

    @IsOptional()
    @IsEmail()
    email;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    profile_id;
}