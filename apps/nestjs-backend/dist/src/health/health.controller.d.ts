import { HealthCheckService, MikroOrmHealthIndicator, HealthCheckResult } from '@nestjs/terminus';
export declare class HealthController {
    private readonly health;
    private readonly db;
    constructor(health: HealthCheckService, db: MikroOrmHealthIndicator);
    check(): Promise<HealthCheckResult>;
}
