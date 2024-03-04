import Database from "@ioc:Adonis/Lucid/Database";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import { InformativoSchema } from "App/Schemas/Informativo";
import { schema } from "@ioc:Adonis/Core/Validator";
import Informativo from "App/Models/Informativo";

export default class Receipts {
  public getInformativos = async ({ response, auth }: HttpContextContract) => {
    const { user } = auth;

    const data = DateTime.now().toFormat("yyyy-MM-dd");

    const informativos = await Database.connection("pg").rawQuery(
      `SELECT * FROM public.vw_ml_sac_informativo_funcionario
            where funcionario_id = ${user?.id_funcionario}
            and vigencia_ini <= '${data}'
            and vigencia_fim > '${data}'
            and cancelado = false
            order by dt_cadastro desc
            `
    );

    response.json({ informativos: informativos.rows });
  };

  public getInformativosNotify = async ({
    response,
    auth,
  }: HttpContextContract) => {
    const { user } = auth;

    const data = DateTime.now().toFormat("yyyy-MM-dd");

    const informativos = await Database.connection("pg").rawQuery(
      `SELECT * FROM public.vw_ml_sac_informativo_funcionario
            where funcionario_id = ${user?.id_funcionario}
            and vigencia_ini <= '${data}'
            and vigencia_fim > '${data}'
            and cancelado = false
            and status_id = 1
            order by dt_cadastro desc
            `
    );

    response.json({ notifyNumber: informativos.rows.length });
  };

  public updateInformativo = async ({
    request,
    response,
    auth,
  }: HttpContextContract) => {
    try {
      const data = await request.validate({
        schema: schema.create(InformativoSchema),
      });

      const { user } = auth;

      if (!user) {
        return response.json({ error: "Usuário não encontrado!" });
      }

      let informativo = await Informativo.query()
        .from("ml_sac_informativo_visualizacao")
        .select("*")
        .where("informativo_id", data.informativo_id)
        .where("funcionario_id", user.id_funcionario)
        .where("id", data.id)
        .where("informativo_id", data.informativo_id)
        .where("empresa_id", user.id_empresa)
        .first();

      if (!informativo) {
        return response.json({ error: "Informativo não encontrado!" });
      }

      const dataAtual = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss.SSS ZZZ");

      informativo
        .merge({
          status_id: 2,
          dt_leitura: dataAtual,
        })
        .save();

      response.json(informativo);
    } catch (error) {
      response.json(error);
    }
  };
}
