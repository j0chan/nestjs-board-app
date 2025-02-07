import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../users/entities/user-role.enum"

export const ROLES_KEY = 'roels'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)