import { IsNotEmpty, IsString } from "class-validator";

export class CreateAvatarUploadUrlDto {
    @IsString()
    @IsNotEmpty()
    mediaContentType: string;
}