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
class Empresa extends Orm_1.BaseModel {
    static get table() {
        return 'ml_ctr_empresa';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Empresa.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "nomeempresarial", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "cnpj", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "logradouro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "numero", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "complemento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "cep", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "bairro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "municipio", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "uf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "telefone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "situacaocadastral", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Empresa.prototype, "dt_situacaocadastral", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "contato", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Empresa.prototype, "id_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Empresa.prototype, "id_usuario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Empresa.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "background", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "primary_color", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "logo", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Empresa.prototype, "dt_cadastro", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Empresa.prototype, "updatedat", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Empresa.prototype, "bucket", void 0);
exports.default = Empresa;
//# sourceMappingURL=Empresa.js.map