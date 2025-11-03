import { IsEmail, IsString, IsInt, MinLength } from "class-validator";
import { Type } from "class-transformer";

export default class CreateUserDto {
    @IsString()
    name;

    @IsEmail()
    email;

    @IsString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password;

    @IsInt()
    @Type(() => Number)
    profile_id;
}