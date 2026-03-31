import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class GymRolesGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: import('@nestjs/common').ExecutionContext): boolean;
}
