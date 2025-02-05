import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto))
        return userResponseDto
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
        const accessToken = await this.authService.signIn(loginUserDto)

        // [2] JWT를 쿠키에 저장
        res.cookie('Authorization', accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 360000,
            sameSite: 'none'
        })

        res.send({ message: 'Login Success' })
    }

    // JWT 동작 테스트
    @Post('/test')
    @UseGuards(AuthGuard('jwt')) // @UseGuard: 해당 인증 가드가 적용되는 라우터 명시
                                 // AuthGuard: 인증 가드가 어떤 전략을 사용할 지 결정
    testForAuth(@Req() req: Request) {
        console.log(req.user)
        return {message: 'Authenticated User', user: req.user}
    } 
}
