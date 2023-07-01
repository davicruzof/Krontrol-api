import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Solicitacao from "App/Models/Solicitacao";
import SolicitacaoFerias from "App/Models/SolicitacaoFerias";
import { solicitacaoSchema } from "App/Schemas/Solicitacao";
import Notifications from "App/Models/Notifications";
import { DateTime } from "luxon";

export default class SolicitacoesController {
  public async create({ request, response, auth }: HttpContextContract) {
    await request.validate({ schema: schema.create(solicitacaoSchema) });
    let dados = request.body();

    try {
      await Solicitacao.create({
        id_empresa_grupo: auth.user?.id_grupo,
        id_empresa: auth.user?.id_empresa,
        id_funcionario: auth.user?.id_funcionario,
        id_area: dados.id_area,
        id_modulo: dados.id_modulo,
        justificativa: dados.justificativa,
        dt_informada: dados?.dt_informada,
      });
    } catch (error) {
      response.json(error);
    }

    response.json({ status: "Solicitação cadastrada " });
  }

  public async getById({ request, response }: HttpContextContract) {
    let dados = request.body();
    if (dados.id_solicitacao) {
      let solicitacao = await Database.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            func.nome,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            INNER JOIN ml_fol_funcionario func ON (func.id_funcionario = sol.id_funcionario)
            WHERE id_solicitacao = ${dados.id_solicitacao}
        `);
      response.json(solicitacao.rows);
    }
  }

  public async list({ request, response, auth }: HttpContextContract) {
    let dados = request.body();
    let condicoes: string = "";

    if (dados.status) {
      condicoes += ` AND sol.status = '${dados.status}' `;
    }
    if (dados.departamento) {
      condicoes += ` AND sol.id_area in (${dados.departamento.toString()}) `;
    }

    let solicitacoes = await Database.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            func.nome,
            func.registro,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            INNER JOIN ml_fol_funcionario func ON (func.id_funcionario = sol.id_funcionario)
            WHERE sol.id_empresa = ${auth.user?.id_empresa}
            ${condicoes}
            ORDER BY dt_cadastro
        `);

    response.json(solicitacoes.rows);
  }

  public async listByUser({ request, response, auth }) {
    let dados = request.body();
    let condicoes: string = "";

    if (dados.status) {
      condicoes += ` AND sol.status = '${dados.status}' `;
    }

    let solicitacoes = await Database.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            WHERE sol.id_empresa = '${auth.user?.id_empresa}'
            AND sol.id_funcionario = '${auth.user?.id_funcionario}'
            ${condicoes}
            ORDER BY dt_cadastro
        `);

    response.json(solicitacoes.rows);
  }

  public async update({ request, response, auth }: HttpContextContract) {
    let dados = request.body();

    let solicitacao = await Solicitacao.findBy(
      "id_solicitacao",
      dados.id_solicitacao
    );

    if (auth.user)
      if (solicitacao) {
        if (dados.status == "ANDAMENTO") {
          solicitacao.id_funcionario_analise = auth.user.id_funcionario;
        }
        if (dados.status == "ATENDIDA") {
          solicitacao.id_funcionario_finalizada = auth.user.id_funcionario;
        }
        solicitacao.merge(dados).save();

        let dadoNotify = await Database.connection("pg").rawQuery(`
            SELECT *
            FROM ml_ctr_programa_area_modulo
            WHERE id_modulo = ${solicitacao.id_modulo}
        `);

        await Notifications.create({
          message: `A sua solicitação de ${dadoNotify.rows[0].modulo} foi atualizada`,
          id_funcionario: solicitacao[0].id_funcionario,
          type: 1,
          created_at: DateTime.now().toString(),
        });

        response.json({ sucess: "Atualizado com sucesso" });
      } else {
        response.json({ error: "Erro ao atualizar" });
      }
  }

  public async getParameter({ response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const parameter = await SolicitacaoFerias.query().where(
          "id_empresa",
          auth.user?.id_empresa
        );
        response.json(parameter);
      }
    } catch (error) {
      response.json(error);
    }
  }
}
