import { schema } from "@ioc:Adonis/Core/Validator";
import { GrupoSchemaInsert, GrupoSchemaUpdate } from "./../../Schemas/Grupo";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Grupo from "App/Models/Grupo";

export default class GruposController {
  public async getAll({ response }: HttpContextContract) {
    let grupos = await Grupo.all();
    response.json(grupos);
  }

  public async create({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({ schema: schema.create(GrupoSchemaInsert) });

      const dados = request.all();

      await Grupo.create({
        id_empresa_grupo: dados.id_empresa_grupo,
        id_empresa: dados.id_empresa ? dados.id_empresa : auth.user?.id_empresa,
        grupo: dados.grupo,
        id_funcionario_cadastro: auth.user?.id_funcionario,
        id_status: dados.id_status,
      });

      response.json({ sucess: "Criado com sucesso! " });
    } catch (error) {
      response.json(error);
    }
  }

  public async getByName({ request, response }: HttpContextContract) {
    let { nomeGrupo } = request.body();

    if (nomeGrupo) {
      let grupo = await Grupo.query()
        .select("*")
        .where("grupo", "LIKE", "%" + nomeGrupo + "%");
      if (grupo) {
        response.json(grupo);
      } else {
        response.json({ error: "Grupo não encontrado" });
      }
    } else {
      response.json({ error: "Grupo não encontrado" });
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({ schema: schema.create(GrupoSchemaUpdate) });

      const dados = request.body();
      const grupo = await Grupo.findBy("id_grupo", dados.id_grupo);
      if (grupo) {
        grupo
          .merge({
            id_empresa_grupo: dados.id_empresa_grupo,
            id_empresa: dados.id_empresa,
            grupo: dados.grupo,
            id_status: dados.id_status,
            id_funcionario_alteracao: auth.user?.id_funcionario,
          })
          .save();
        response.json({ sucess: "Atualizado com sucesso" });
      }
    } catch (error) {
      response.json(error);
    }
  }
}
