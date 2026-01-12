import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    token: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    confirmNewPassword: string;
}