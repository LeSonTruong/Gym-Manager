export type AuditActionMetadata = {
    action: string;
    resource: string;
};
export declare const AUDIT_ACTION_KEY = "audit-action";
export declare const AuditAction: (action: string, resource: string) => MethodDecorator;
