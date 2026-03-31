"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.AUDIT_ACTION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUDIT_ACTION_KEY = 'audit-action';
const AuditAction = (action, resource) => (0, common_1.SetMetadata)(exports.AUDIT_ACTION_KEY, { action, resource });
exports.AuditAction = AuditAction;
//# sourceMappingURL=audit-action.decorator.js.map