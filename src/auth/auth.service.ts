import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    // Sign-In
    async signIn(signInRequestDto: SignInRequestDto): Promise<string> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is signing in`)
        const { email, password } = signInRequestDto

        try {
            const existingUser = await this.userService.findUserByEmail(email)

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                this.logger.error(`Invalid credentials`)
                throw new UnauthorizedException('Invalid credentials')
            }

            const payload = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role,
            }
            const accessToken = await this.jwtService.sign(payload)

            this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`)
            return accessToken
        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`)
            throw error;
        }
    }
}
