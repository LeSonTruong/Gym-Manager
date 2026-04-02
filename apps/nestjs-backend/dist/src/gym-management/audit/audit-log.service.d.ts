import { MikroORM } from "@mikro-orm/core";
type CreateAuditLogInput = {
    action: string;
    resource: string;
    recordId?: string;
    changedByUserId?: string;
    requestBody?: unknown;
    responseBody?: unknown;
    statusCode: number;
    method: string;
    path: string;
};
export declare class AuditLogService {
    private readonly orm;
    private readonly logger;
    constructor(orm: MikroORM);
    createAuditLog(input: CreateAuditLogInput): Promise<void>;
    private toSafePayload;
    private redactSensitive;
    private isObjectRecord;
}
export {};
