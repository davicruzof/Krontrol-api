"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GrupoEvento_1 = require("./../../Schemas/GrupoEvento");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const GrupoEvento_2 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/GrupoEvento"));
class GrupoEventosController {
    async getById({ request, response }) {
        const id_associacao = request.body();
        let grupoEvento = await GrupoEvento_2.default.findBy('id_associacao', id_associacao);
        if (grupoEvento) {
            response.json(grupoEvento);
        }
        else {
            response.json({ error: 'Não encontrado!' });
        }
    }
    async getAll({ response }) {
        const grupoEvento = GrupoEvento_2.default.all();
        response.json(grupoEvento);
    }
    async create({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(GrupoEvento_1.GrupoEventoSchemaInsert) });
            const dados = request.all();
            await GrupoEvento_2.default.create({
                id_empresa_grupo: dados.id_empresa_grupo,
                id_empresa: dados.id_empresa ? dados.id_empresa : auth.user?.id_empresa,
                id_telemetria_grupo: dados.id_telemetria_grupo,
                id_telemetria_evento: dados.id_telemetria_evento,
                id_funcionario_cadastro: auth.user?.id_funcionario,
                id_status: dados.id_status
            });
            response.json({ sucess: 'Criado com sucesso!' });
        }
        catch (error) {
            response.json(error);
        }
    }
    async update({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(GrupoEvento_1.GrupoEventoSchemaUpdate) });
            const dados = request.body();
            const grupoEvento = await GrupoEvento_2.default.findBy('id_associacao', dados.id_associacao);
            if (grupoEvento) {
                await grupoEvento.merge({
                    id_empresa_grupo: dados.id_empresa_grupo,
                    id_empresa: dados.id_empresa,
                    id_telemetria_grupo: dados.id_telemetria_grupo,
                    id_telemetria_evento: dados.id_telemetria_evento,
                    id_funcionario_alteracao: auth.user?.id_funcionario
                }).save();
                response.json({ sucess: 'Atualizado com sucesso!' });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = GrupoEventosController;
//# sourceMappingURL=GrupoEventosController.js.map