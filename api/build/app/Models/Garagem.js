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
class Garagem extends Orm_1.BaseModel {
    static get table() {
        return 'ml_ctr_empresa_garagem';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Garagem.prototype, "id_garagem", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Garagem.prototype, "id_empresa", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Garagem.prototype, "id_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Garagem.prototype, "garagem", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Garagem.prototype, "id_usuario_cadastro", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Garagem.prototype, "id_usuario_alteracao", void 0);
__decorate([
    Orm_1.column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Garagem.prototype, "dt_alteracao", void 0);
exports.default = Garagem;
//# sourceMappingURL=Garagem.js.map