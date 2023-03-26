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
const Garagem_1 = __importDefault(require("./Garagem"));
class Veiculo extends Orm_1.BaseModel {
    static get table() {
        return 'ml_man_frota';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_veiculo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_garagem", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_erp", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Veiculo.prototype, "prefixo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Veiculo.prototype, "placa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Veiculo.prototype, "ano_fabricacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Veiculo.prototype, "ano_modelo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "media_consumo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_destinacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Veiculo.prototype, "chassi", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Veiculo.prototype, "modelo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Veiculo.prototype, "foto", void 0);
__decorate([
    Orm_1.column.dateTime({ autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Veiculo.prototype, "dt_alteracao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_funcionario_alteracao", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Veiculo.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id_funcionario_cadastro", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Garagem_1.default, { foreignKey: 'id_garagem' }),
    __metadata("design:type", Object)
], Veiculo.prototype, "garagem", void 0);
exports.default = Veiculo;
//# sourceMappingURL=Veiculo.js.map