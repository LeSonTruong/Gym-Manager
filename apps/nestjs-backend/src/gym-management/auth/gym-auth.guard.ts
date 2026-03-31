import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { GymManagementService } from '../gym-management.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class GymAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly gymManagementService: GymManagementService,
  ) { }

  async canActivate(context: import('@nestjs/common').ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const accessToken = this.extractBearerToken(request);

    request.user = await this.gymManagementService.validateAccessToken(accessToken);

    return true;
  }

  private extractBearerToken(request: Request): string {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization scheme');
    }

    return token;
  }
}
