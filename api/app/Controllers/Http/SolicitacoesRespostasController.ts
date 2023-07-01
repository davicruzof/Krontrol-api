import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Notifications from "App/Models/Notifications";
import Solicitacao from "App/Models/Solicitacao";
import SolicitacaoResposta from "App/Models/SolicitacaoResposta";
import {
  SolicitacaoRespostaGetIdSchema,
  SolicitacaoRespostaSchema,
} from "App/Schemas/Solicitacao";
import { DateTime } from "luxon";

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

          dados.respondido_por === "2" &&
            (await Notifications.create({
              message: `Uma nova mensagem para uma solicitação`,
              id_funcionario: solicitacao[0].id_funcionario,
              type: 1,
              created_at: DateTime.now().toString(),
            }));

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
    await request.validate({
      schema: schema.create(SolicitacaoRespostaGetIdSchema),
    });

    const { id_solicitacao } = request.body();

    try {
      const mensagens = await Database.connection("pg").rawQuery(
        `SELECT MSG.*, FUNC.nome
            FROM ml_sac_solicitacao_resposta as MSG
            INNER JOIN ml_fol_funcionario as FUNC
            ON MSG.id_funcionario_resposta = FUNC.id_funcionario
            WHERE id_solicitacao=${id_solicitacao}
            ORDER BY id DESC`
      );

      const request = await Solicitacao.findBy(
        "id_solicitacao",
        id_solicitacao
      );

      const responseData = {
        messages: mensagens.rows,
        status: request?.status,
      };

      response.json(responseData);
    } catch (error) {
      response.json(error);
    }
  }
}
