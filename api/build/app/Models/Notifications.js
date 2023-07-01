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
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class Notifications extends Orm_1.BaseModel {
    static get table() {
        return "ml_notifications";
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Notifications.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notifications.prototype, "id_funcionario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notifications.prototype, "id_solicitacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notifications.prototype, "message", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Notifications.prototype, "read", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Notifications.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Notifications.prototype, "created_at", void 0);
exports.default = Notifications;
//# sourceMappingURL=Notifications.js.map