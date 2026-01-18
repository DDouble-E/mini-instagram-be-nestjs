import { IsNotEmpty, IsString } from "class-validator";

export class CreateContainerDto {
    @IsString()
    @IsNotEmpty()
    mediaContentType: string;
}