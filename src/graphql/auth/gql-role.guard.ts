import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthUser } from './auth-user';
import { UserRoleEnum } from '../enum/user-role.enum';

const ROLES_KEY = 'ROLES_KEY';

export const Roles = (...roles: UserRoleEnum[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>(ROLES_KEY, ctx.getHandler());

    if (!roles) {
      return true;
    }

    const request = ctx.getContext().req;
    const user: AuthUser = request.user;

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
