import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GymManagementService } from '../gym-management.service';
export declare class GymAuthGuard implements CanActivate {
    private readonly reflector;
    private readonly gymManagementService;
    constructor(reflector: Reflector, gymManagementService: GymManagementService);
    canActivate(context: import('@nestjs/common').ExecutionContext): Promise<boolean>;
    private extractBearerToken;
}
