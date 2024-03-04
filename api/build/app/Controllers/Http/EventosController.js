"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Evento_1 = global[Symbol.for('ioc.use')]("App/Schemas/Evento");
const Evento_2 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Evento"));
class EventosController {
    async create({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Evento_1.EventoSchemaInsert) });
            const dados = request.all();
            await Evento_2.default.create({
                id_evento: dados.id_evento,
                id_evento_telemetria: dados.id_evento_telemetria,
                evento: dados.evento,
                id_empresa_telemetria: dados.id_empresa_telemetria,
                id_funcionario_cadastro: auth.user?.id_funcionario,
            });
            response.json({ sucess: "Criado com sucesso!" });
        }
        catch (error) {
            response.json(error);
        }
    }
    async getAll({ response }) {
        let eventos = await Evento_2.default.all();
        response.json({
            eventos,
        });
    }
    async update({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Evento_1.EventoSchemaUpdate) });
            const dados = request.body();
            const evento = await Evento_2.default.findBy("id_evento", dados.id_evento);
            if (evento) {
                await evento
                    .merge({
                    id_evento: dados.id_evento,
                    id_evento_telemetria: dados.id_evento_telemetria,
                    evento: dados.evento,
                    id_empresa_telemetria: dados.id_empresa_telemetria,
                    id_funcionario_alteracao: auth.user?.id_funcionario,
                    id_status: dados.id_status,
                })
                    .save();
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = EventosController;
//# sourceMappingURL=EventosController.js.map