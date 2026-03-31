import { SetMetadata } from '@nestjs/common';

export type AuditActionMetadata = {
  action: string;
  resource: string;
};

export const AUDIT_ACTION_KEY = 'audit-action';

export const AuditAction = (action: string, resource: string): MethodDecorator =>
  SetMetadata(AUDIT_ACTION_KEY, { action, resource } satisfies AuditActionMetadata);
