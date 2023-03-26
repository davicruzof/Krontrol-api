"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class PdfsController {
    async upload({ request, response }) {
        const files = request.files('files');
        return files;
    }
    async getConfirmedsById({ request, response }) {
        const id = request.body().id;
        if (id) {
            let dados = await Database_1.default.connection('pg').rawQuery(`
                SELECT c.*, f.nome,f.id_funcionario_erp,f.id_empresa,f.registro
                FROM ml_pdf_confirmed c
                INNER JOIN ml_fol_funcionario f on (c.id_funcionario = f.id_funcionario)
                WHERE c.id_pdf_confirmed = '${id}'
            `);
            response.json(dados.rows);
        }
        else {
            response.badRequest({ error: "Erro interno" });
        }
    }
    async getAllConfirmeds({ request, response }) {
        let dados = await Database_1.default.connection('pg').rawQuery(`
                SELECT c.*, to_char(c.data_cadastro, 'DD/MM/YYYY HH24:MM:SS') as data_cadastro, f.nome,f.id_funcionario_erp,f.id_empresa,f.registro
                FROM ml_pdf_confirmed c
                INNER JOIN ml_fol_funcionario f on (c.id_funcionario = f.id_funcionario)
                ORDER BY c.id_pdf_confirmed
            `);
        response.json(dados.rows);
    }
}
exports.default = PdfsController;
//# sourceMappingURL=PdfsController.js.map