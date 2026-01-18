import { IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { LocationDto } from "./location.dto";
import { Type } from "class-transformer";

export class PublishPostDto {

    @IsString()
    @IsNotEmpty()
    caption: string;


    @IsOptional()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto
}