import type { UserRole } from '@next-nest-turbo-boilerplate/shared';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => MethodDecorator & ClassDecorator;
