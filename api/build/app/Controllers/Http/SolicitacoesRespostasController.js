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
class SolicitacoesRespostasController {
    async create({ request, response, auth }) {
        await request.validate({
            schema: Validator_1.schema.create(Solicitacao_2.SolicitacaoRespostaSchema),
        });
        const dados = request.body();
        try {
            if (auth.user?.id_funcionario) {
                const solicitacao = await Solicitacao_1.default.query()
                    .where("id_solicitacao", dados.id_solicitacao)
                    .whereNot("status", "ATENDIDA")
                    .where("id_funcionario", auth.user?.id_funcionario)
                    .orWhere("id_funcionario_analise", auth.user?.id_funcionario);
                if (solicitacao) {
                    await SolicitacaoResposta_1.default.create({
                        ...dados,
                        id_funcionario_resposta: auth.user?.id_funcionario,
                    });
                    dados.respondido_por === "2" &&
                        (await Notifications_1.default.create({
                            message: `Uma nova mensagem para uma solicitação`,
                            id_funcionario: auth.user?.id_funcionario,
                            type: 1,
                            created_at: new Date().toLocaleString("pt-BR"),
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
            const mensagens = await Database_1.default.connection("pg").rawQuery(`SELECT MSG.*, FUNC.nome
            FROM ml_sac_solicitacao_resposta as MSG
            INNER JOIN ml_fol_funcionario as FUNC
            ON MSG.id_funcionario_resposta = FUNC.id_funcionario
            WHERE id_solicitacao=${id_solicitacao}
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