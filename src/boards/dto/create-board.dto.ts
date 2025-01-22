import { IsNotEmpty, IsString, Matches } from "class-validator"

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

    // @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', }) // 대문자, 소문자, 숫자, 특수문자 포함
    // password: string;
}