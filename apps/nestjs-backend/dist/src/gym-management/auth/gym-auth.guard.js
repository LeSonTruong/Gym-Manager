"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const gym_management_service_1 = require("../gym-management.service");
const public_decorator_1 = require("./public.decorator");
let GymAuthGuard = class GymAuthGuard {
    reflector;
    gymManagementService;
    constructor(reflector, gymManagementService) {
        this.reflector = reflector;
        this.gymManagementService = gymManagementService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractBearerToken(request);
        request.user = await this.gymManagementService.validateAccessToken(accessToken);
        return true;
    }
    extractBearerToken(request) {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            throw new common_1.UnauthorizedException('Missing authorization header');
        }
        const [scheme, token] = authorizationHeader.split(' ');
        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            throw new common_1.UnauthorizedException('Invalid authorization scheme');
        }
        return token;
    }
};
exports.GymAuthGuard = GymAuthGuard;
exports.GymAuthGuard = GymAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        gym_management_service_1.GymManagementService])
], GymAuthGuard);
//# sourceMappingURL=gym-auth.guard.js.map