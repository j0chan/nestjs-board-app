import { IsNotEmpty, IsString } from "class-validator"

export class UpdateBlogDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    contents: string
}