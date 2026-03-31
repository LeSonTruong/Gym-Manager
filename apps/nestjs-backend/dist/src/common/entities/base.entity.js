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
exports.BaseEntity = void 0;
const node_crypto_1 = require("node:crypto");
const core_1 = require("@mikro-orm/core");
class BaseEntity {
    id = (0, node_crypto_1.randomUUID)();
    createdAt = new Date();
    updatedAt = new Date();
    [core_1.OptionalProps];
}
exports.BaseEntity = BaseEntity;
__decorate([
    (0, core_1.PrimaryKey)({ type: core_1.types.string, length: 120 }),
    __metadata("design:type", String)
], BaseEntity.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), onUpdate: () => new Date(), type: core_1.types.datetime, columnType: 'timestamp' }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.entity.js.map