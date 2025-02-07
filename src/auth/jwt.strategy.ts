import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../users/entities/user.entity";
import * as dotenv from 'dotenv';
import { UserService } from "src/users/user.service";

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name)

    constructor(private userService: UserService) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload) {
        const { email } = payload

        const user: User = await this.userService.findUserByEmail(email)

        if (!user) {
            this.logger.error(`User not found or Internal Server Error`)
            throw new UnauthorizedException()
        }
        return user
    }
}