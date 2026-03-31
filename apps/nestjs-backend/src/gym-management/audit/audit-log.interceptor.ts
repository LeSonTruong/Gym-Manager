import { type CallHandler, type ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';
import type { AuthenticatedUser } from '../auth/authenticated-user.type';
import { AUDIT_ACTION_KEY, type AuditActionMetadata } from './audit-action.decorator';
import { AuditLogService } from './audit-log.service';

type AuditAwareRequest = Request & {
  user?: AuthenticatedUser;
  body?: unknown;
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = this.reflector.getAllAndOverride<AuditActionMetadata | undefined>(AUDIT_ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AuditAwareRequest>();
    const response = context.switchToHttp().getResponse<{ statusCode?: number }>();
    const recordId = (request.params?.id as string | undefined) ?? (request.params?.key as string | undefined);

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        void this.auditLogService.createAuditLog({
          action: metadata.action,
          resource: metadata.resource,
          recordId,
          changedByUserId: request.user?.user.id,
          requestBody: request.body,
          responseBody,
          statusCode: response.statusCode ?? 200,
          method: request.method,
          path: request.route?.path ?? request.path,
        });
      }),
    );
  }
}
