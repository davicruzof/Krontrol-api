import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Solicitacao from "App/Models/Solicitacao";
import SolicitacaoResposta from "App/Models/SolicitacaoResposta";
import { SolicitacaoRespostaSchema } from "App/Schemas/Solicitacao";

export default class SolicitacoesRespostasController {
  public async create({ request, response, auth }: HttpContextContract) {
    await request.validate({
      schema: schema.create(SolicitacaoRespostaSchema),
    });

    const dados = request.body();

    try {
      if (auth.user?.id_funcionario) {
        const solicitacao = await Solicitacao.query()
          .where("id_solicitacao", dados.id_solicitacao)
          .whereNot("status", "ATENDIDA")
          .where("id_funcionario", auth.user?.id_funcionario)
          .orWhere("id_funcionario_analise", auth.user?.id_funcionario);

        if (solicitacao) {
          await SolicitacaoResposta.create({
            ...dados,
            id_funcionario_resposta: auth.user?.id_funcionario,
          });

          response.json({ success: "Mensagem enviada!" });
        } else {
          response.json({ error: "Não é possível enviar essa mensagem" });
        }
      } else {
        response.json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    const { id_solicitacao } = request.body();

    try {
      if (id_solicitacao) {
        const solicitacao = await SolicitacaoResposta.query()
          .select("*")
          .where("id_solicitacao", id_solicitacao);

        response.json(solicitacao);
      } else {
        response.json({ error: "Não é possível enviar essa mensagem" });
      }
    } catch (error) {
      response.json(error);
    }
  }
}
