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
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class Solicitacao extends Orm_1.BaseModel {
    static get table() {
        return 'ml_sac_solicitacao';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_solicitacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_empresa_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_funcionario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_evento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_area", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_modulo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_programa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Solicitacao.prototype, "justificativa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Solicitacao.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_parecer", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Solicitacao.prototype, "parecer", void 0);
__decorate([
    Orm_1.column.dateTime({}),
    __metadata("design:type", luxon_1.DateTime)
], Solicitacao.prototype, "dt_analise", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_funcionario_analise", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Solicitacao.prototype, "dt_finalizada", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_funcionario_finalizada", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Solicitacao.prototype, "id_avaliacao", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Solicitacao.prototype, "dt_cadastro", void 0);
__decorate([
    Orm_1.column.dateTime({ autoUpdate: true, autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Solicitacao.prototype, "dt_atualizacao", void 0);
exports.default = Solicitacao;
//# sourceMappingURL=Solicitacao.js.map