import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './users-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    // 회원 가입
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong.')
        }

        await this.checkEmailExist(email)

        const hashedPassword = await this.hashPassword(password)

        const newUser: User = {
            id: 0,
            username,
            password: hashedPassword,
            email,
            role: UserRole.USER,
        }
        const createdUser = await this.userRepository.save(newUser)
        return createdUser;
    }

    // 로그인
    async signIn(loginUserDto: LoginUserDto): Promise<string> {
        const { email, password } = loginUserDto

        const existingUser = await this.findUserByEmail(email)

        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const message = 'Login success'
        return message
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
        const salt = await bcrypt.genSalt() // 솔트 생성
        return await bcrypt.hash(password, salt) // 비밀번호 해싱
    }
}
