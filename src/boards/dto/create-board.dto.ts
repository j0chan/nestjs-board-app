import { IsNotEmpty, IsString } from "class-validator"

export class CreateBoardDto {
    @IsNotEmpty() // Null 값 유효성 검사
    @IsString()
    author: string
    
    @IsNotEmpty()
    @IsString()
    title: string
    
    @IsNotEmpty()
    @IsString()
    contents: string
}