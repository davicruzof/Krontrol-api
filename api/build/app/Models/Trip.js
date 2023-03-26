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
class Trip extends Orm_1.BaseModel {
    static get table() {
        return 'ml_int_telemetria_kontrow_trips';
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Trip.prototype, "id_viagem", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "worker_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Trip.prototype, "driver_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "asset_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "engine_hours", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "end_drive", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "mileage", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "drive_duration", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "total_mileage", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "fuel_used", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "start_latitude", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "start_longitude", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "end_latitude", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "end_longitude", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Trip.prototype, "log_gps_processed", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "id_grupo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "id_empresa", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "id_funcionario_cadastro", void 0);
exports.default = Trip;
//# sourceMappingURL=Trip.js.map