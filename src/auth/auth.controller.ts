import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)
    constructor(private authService: AuthService) { }

    // 회원 가입
    @Post('/signup')
    async createUser(@Body() signUpRequestDto: SignUpRequestDto): Promise<UserResponseDto> {
        this.logger.verbose(`Visitor is try to creating a new account with email: ${signUpRequestDto.email}`)
        const userResponseDto = new UserResponseDto(await this.authService.createUser(signUpRequestDto))

        this.logger.verbose(`New account email with ${signUpRequestDto.email} created Successfully`)
        return userResponseDto
    }

    // 로그인
    @Post('/signin')
    async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`)
        const accessToken = await this.authService.signIn(signInRequestDto)

        res.setHeader('Authorization', accessToken)

        res.send({ message: 'Login Success' })
        this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`)
    }
}
