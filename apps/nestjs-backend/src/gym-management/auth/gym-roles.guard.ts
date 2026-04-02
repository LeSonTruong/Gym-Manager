import type { UserRole } from '@next-nest-turbo-boilerplate/shared';
import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedUser } from './authenticated-user.type';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class GymRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
 
  }

  canActivate(context: import('@nestjs/common').ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const {user} = request;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied for current role');
    }

    return true;
  }
}
