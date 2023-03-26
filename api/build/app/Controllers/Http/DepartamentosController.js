"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class DepartamentosController {
    async list({ response }) {
        let result = await Database_1.default.connection('pg')
            .from('ml_ctr_programa_area')
            .select('*')
            .where('solicitacao', '=', '1');
        response.json(result);
    }
    async list_area_departamento({ request, response }) {
        let id_area = request.body().id_area;
        let result;
        if (id_area) {
            result = await Database_1.default.connection('pg')
                .from('ml_ctr_programa_area_modulo')
                .select('*')
                .where('id_area', '=', id_area)
                .where('solicitacao', '=', '1');
        }
        response.json(result);
    }
}
exports.default = DepartamentosController;
//# sourceMappingURL=DepartamentosController.js.map