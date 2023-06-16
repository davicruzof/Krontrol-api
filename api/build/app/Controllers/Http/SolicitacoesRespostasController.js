"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
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
        const { id_solicitacao } = request.body();
        try {
            if (id_solicitacao) {
                const solicitacao = await SolicitacaoResposta_1.default.query()
                    .select("*")
                    .where("id_solicitacao", id_solicitacao);
                response.json(solicitacao);
            }
            else {
                response.json({ error: "Não é possível enviar essa mensagem" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = SolicitacoesRespostasController;
//# sourceMappingURL=SolicitacoesRespostasController.js.map