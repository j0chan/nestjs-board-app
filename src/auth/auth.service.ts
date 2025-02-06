import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dto/sign-in-request.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    // 회원 가입
    async createUser(signUpRequestDto: SignUpRequestDto): Promise<User> {
        this.logger.verbose(`Visitor is creating a new account with email: ${signUpRequestDto.email}`)
        const { username, password, email, role } = signUpRequestDto
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong.')
        }

        await this.checkEmailExist(email)

        const hashedPassword = await this.hashPassword(password)

        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: UserRole.USER,
        })
        const createdUser = await this.userRepository.save(newUser)

        this.logger.verbose(`New account email with ${createdUser.email} created Successfully`)
        return createdUser;
    }

    // 로그인
    async signIn(signInRequestDto: SignInRequestDto): Promise<string> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is signing in`)
        const { email, password } = signInRequestDto

        try {
            const existingUser = await this.findUserByEmail(email)

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

    // 이메일 중복 확인
    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email } })
        if (existingUser) {
            throw new ConflictException('Email already exists')
        }
    }

    // 이메일 존재 확인
    async findUserByEmail(email): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email } })
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }
        return existingUser
    }

    // 비밀번호 해싱
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }
}
