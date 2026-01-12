
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {

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

    @ApiPropertyOptional({
        type: String,
        format: 'date',
        example: '2026-01-12',
        description: 'yyyy-MM-dd',
    })
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsDate()
    dateOfBirth?: Date;


    @IsOptional()
    @IsString()
    gender?: string;


    @IsOptional()
    @IsString()
    phoneNumber?: string;


}
