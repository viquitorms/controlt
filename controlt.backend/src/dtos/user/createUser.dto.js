import { IsString, IsEmail, MinLength } from "class-validator";

export default class CreateUserDto {
    @IsString()
    name;

    @IsEmail()
    email;

    @IsString()
    @MinLength(6)
    password;
}