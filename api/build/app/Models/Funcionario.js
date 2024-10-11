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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Situacao_1 = __importDefault(require("./Situacao"));
const Sexo_1 = __importDefault(require("./Sexo"));
const Cnh_1 = __importDefault(require("./Cnh"));
const Funcao_1 = __importDefault(require("./Funcao"));
class Funcionario extends Orm_1.BaseModel {
    static get table() {
        return "ml_fol_funcionario";
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_funcionario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "nome", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "registro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_funcionario_erp", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_funcionario_erp_anterior", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_funcao_erp", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_cnh", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "celular", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "rfid", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Funcionario.prototype, "dt_admissao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Funcionario.prototype, "dt_demissao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "cnh_emissao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Funcionario.prototype, "cnh_validade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_funcionario_alteracao", void 0);
__decorate([
    Orm_1.column.dateTime({ autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Funcionario.prototype, "dt_alteracao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Funcionario.prototype, "dt_nascimento", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_sexo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "pis", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Funcionario.prototype, "foto_url", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Funcionario.prototype, "id_situacao", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Situacao_1.default, { foreignKey: "id_situacao" }),
    __metadata("design:type", Object)
], Funcionario.prototype, "situacao", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Sexo_1.default, { foreignKey: "id_sexo" }),
    __metadata("design:type", Object)
], Funcionario.prototype, "sexo", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Cnh_1.default, { foreignKey: "id_cnh" }),
    __metadata("design:type", Object)
], Funcionario.prototype, "cnh", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Funcao_1.default, { foreignKey: "id_funcao_erp" }),
    __metadata("design:type", Object)
], Funcionario.prototype, "funcao", void 0);
exports.default = Funcionario;
//# sourceMappingURL=Funcionario.js.map