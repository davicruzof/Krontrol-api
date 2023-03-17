import {
  GrupoEventoSchemaInsert,
  GrupoEventoSchemaUpdate,
} from "./../../Schemas/GrupoEvento";
import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GrupoEvento from "App/Models/GrupoEvento";

export default class GrupoEventosController {
  public async getById({ request, response }: HttpContextContract) {
    const id_associacao = request.body();

    let grupoEvento = await GrupoEvento.findBy("id_associacao", id_associacao);

    if (grupoEvento) {
      response.json(grupoEvento);
    } else {
      response.json({ error: "Não encontrado!" });
    }
  }

  public async getAll({ response }: HttpContextContract) {
    const grupoEvento = GrupoEvento.all();

    response.json(grupoEvento);
  }

  public async create({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create(GrupoEventoSchemaInsert),
      });

      const dados = request.all();

      await GrupoEvento.create({
        id_empresa_grupo: dados.id_empresa_grupo,
        id_empresa: dados.id_empresa ? dados.id_empresa : auth.user?.id_empresa,
        id_telemetria_grupo: dados.id_telemetria_grupo,
        id_telemetria_evento: dados.id_telemetria_evento,
        id_funcionario_cadastro: auth.user?.id_funcionario,
        id_status: dados.id_status,
      });
      response.json({ sucess: "Criado com sucesso!" });
    } catch (error) {
      response.json(error);
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create(GrupoEventoSchemaUpdate),
      });

      const dados = request.body();

      const grupoEvento = await GrupoEvento.findBy(
        "id_associacao",
        dados.id_associacao
      );

      if (grupoEvento) {
        await grupoEvento
          .merge({
            id_empresa_grupo: dados.id_empresa_grupo,
            id_empresa: dados.id_empresa,
            id_telemetria_grupo: dados.id_telemetria_grupo,
            id_telemetria_evento: dados.id_telemetria_evento,
            id_funcionario_alteracao: auth.user?.id_funcionario,
          })
          .save();

        response.json({ sucess: "Atualizado com sucesso!" });
      }
    } catch (error) {
      response.json(error);
    }
  }
}
