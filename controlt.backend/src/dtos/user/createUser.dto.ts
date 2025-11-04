import { IsEmail, IsString, IsInt, MinLength } from "class-validator";
import { Type } from "class-transformer";

export default class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password: string;

    @IsInt()
    @Type(() => Number)
    profile_id: number;
}