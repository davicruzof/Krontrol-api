"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class GlobalController {
    constructor() {
        this.getDepartments = async (idFuncionario) => {
            let departamentos = await Database_1.default.connection("pg").rawQuery(`
            SELECT fa.id_area,ar.area
            FROM ml_ctr_funcionario_area fa INNER JOIN ml_ctr_programa_area ar ON (fa.id_area = ar.id_area)
            WHERE fa.id_funcionario = ${idFuncionario}
        `);
            return departamentos.rows;
        };
    }
}
exports.default = GlobalController;
//# sourceMappingURL=GlobalController.js.map