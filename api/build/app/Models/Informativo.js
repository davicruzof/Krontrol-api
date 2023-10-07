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
class Informativo extends Orm_1.BaseModel {
    static get table() {
        return 'ml_sac_informativo_visualizacao';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Informativo.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "empresa_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "funcionario_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "informativo_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "funcionario_cadastro_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "funcionario_alteracao_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Informativo.prototype, "status_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Informativo.prototype, "dt_leitura", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Informativo.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Informativo.prototype, "dt_alteracao", void 0);
exports.default = Informativo;
//# sourceMappingURL=Informativo.js.map