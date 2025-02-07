import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../users/entities/user-role.enum";
import { User } from "../users/entities/user.entity";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requireRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user: User = request.user

        console.log("User from Request: " + user)
        console.log("Requirement from Request: " + requireRoles)

        return requireRoles.some((role) => user.role === role)
    }
}