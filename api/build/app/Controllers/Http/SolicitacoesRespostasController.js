"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Notifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notifications"));
const Solicitacao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Solicitacao"));
const SolicitacaoResposta_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SolicitacaoResposta"));
const Solicitacao_2 = global[Symbol.for('ioc.use')]("App/Schemas/Solicitacao");
const luxon_1 = require("luxon");
class SolicitacoesRespostasController {
    async create({ request, response, auth }) {
        await request.validate({
            schema: Validator_1.schema.create(Solicitacao_2.SolicitacaoRespostaSchema),
        });
        const dados = request.body();
        try {
            if (auth.user?.id_funcionario) {
                const solicitacao = await Solicitacao_1.default.findBy("id_solicitacao", dados.id_solicitacao);
                if (solicitacao) {
                    await SolicitacaoResposta_1.default.create({
                        ...dados,
                        id_funcionario_resposta: auth.user?.id_funcionario,
                    });
                    dados.respondido_por === "2" &&
                        (await Notifications_1.default.create({
                            message: `Uma nova mensagem para uma solicitação`,
                            id_funcionario: solicitacao.id_funcionario,
                            type: 1,
                            created_at: luxon_1.DateTime.now().toString(),
                        }));
                    response.json({ success: "Mensagem enviada!" });
                }
                else {
                    response.json({ error: "Não é possível enviar essa mensagem" });
                }
            }
            else {
                response.json({ error: "Usuário não encontrado" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async getById({ request, response }) {
        await request.validate({
            schema: Validator_1.schema.create(Solicitacao_2.SolicitacaoRespostaGetIdSchema),
        });
        const { id_solicitacao } = request.body();
        try {
            const mensagens = await Database_1.default.connection("pg").rawQuery(`SELECT MSG.*, area.area as nome
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_sac_solicitacao_resposta as MSG
            ON MSG.id_solicitacao = sol.id_solicitacao
            INNER JOIN ml_ctr_programa_area area
            ON sol.id_area = area.id_area
            WHERE sol.id_solicitacao=${id_solicitacao}
            ORDER BY id DESC`);
            const request = await Solicitacao_1.default.findBy("id_solicitacao", id_solicitacao);
            const responseData = {
                messages: mensagens.rows,
                status: request?.status,
            };
            response.json(responseData);
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = SolicitacoesRespostasController;
//# sourceMappingURL=SolicitacoesRespostasController.js.map