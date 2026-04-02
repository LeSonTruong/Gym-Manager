import {
  MikroORM,
  type EntityManager,
  type RequiredEntityData,
} from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { AuditLogEntity, UserEntity } from "../entities/gym-management.entity";

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

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly orm: MikroORM) {
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<void> {
    const em: EntityManager = this.orm.em.fork();
    const changedByUser = input.changedByUserId
      ? await em.findOne(UserEntity, { id: input.changedByUserId })
      : undefined;

    const auditLogEntity = em.create(AuditLogEntity, {
      action: input.action,
      resource: input.resource,
      recordId: input.recordId ?? null,
      changedByUser: changedByUser ?? null,
      method: input.method,
      path: input.path,
      statusCode: input.statusCode,
      requestBody: this.toSafePayload(input.requestBody),
      responseBody: this.toSafePayload(input.responseBody),
    } as RequiredEntityData<AuditLogEntity>);

    em.persist(auditLogEntity);

    try {
      await em.flush();
    } catch (error) {
      this.logger.warn(
        `Unable to persist audit log for ${input.action}: ${String(error)}`,
      );
    }
  }

  private toSafePayload(payload: unknown): unknown {
    if (!payload || typeof payload !== "object") {
      return payload;
    }

    const clone = structuredClone(payload);

    return this.redactSensitive(clone);
  }

  private redactSensitive(payload: unknown): unknown {
    if (!this.isObjectRecord(payload)) {
      return payload;
    }

    if (Array.isArray(payload)) {
      return payload.map((item) => this.redactSensitive(item));
    }

    const redactedPayload: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (["password", "refreshToken", "accessToken"].includes(key)) {
        redactedPayload[key] = "[REDACTED]";
        continue;
      }

      redactedPayload[key] = this.redactSensitive(value);
    }

    return redactedPayload;
  }

  private isObjectRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object";
  }
}
