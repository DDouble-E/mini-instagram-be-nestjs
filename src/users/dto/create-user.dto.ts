
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";



export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    @IsString()
    biography?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateOfBirth?: Date;


    @IsOptional()
    @IsString()
    gender?: string;


    @IsOptional()
    @IsString()
    phoneNumber?: string;


}
