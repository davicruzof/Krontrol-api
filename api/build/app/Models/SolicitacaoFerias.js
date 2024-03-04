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
const luxon_1 = require("luxon");
class SolicitacaoFerias extends Orm_1.BaseModel {
    static get table() {
        return "ml_fol_parametro";
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], SolicitacaoFerias.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SolicitacaoFerias.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], SolicitacaoFerias.prototype, "dt_inicio_pedido", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], SolicitacaoFerias.prototype, "dt_fim_pedido", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], SolicitacaoFerias.prototype, "dt_inicio_gozo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], SolicitacaoFerias.prototype, "dt_fim_gozo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SolicitacaoFerias.prototype, "id_funcionario_cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SolicitacaoFerias.prototype, "id_funcionario_alteracao", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SolicitacaoFerias.prototype, "dt_cadastro", void 0);
__decorate([
    Orm_1.column.dateTime({ autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SolicitacaoFerias.prototype, "dt_alteracao", void 0);
exports.default = SolicitacaoFerias;
//# sourceMappingURL=SolicitacaoFerias.js.map