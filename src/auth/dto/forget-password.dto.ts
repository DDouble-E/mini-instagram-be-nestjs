import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
    @IsString()
    @IsNotEmpty()
    identifier: string; // email or username
}
