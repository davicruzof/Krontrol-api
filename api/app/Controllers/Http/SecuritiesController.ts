import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import SecurityGroup from "App/Models/SecurityGroup";
import SecurityGroupUser from "App/Models/SecurityGroupUser";

export const GrupoSchema = {
  nome: schema.string(),
  itens: schema.string(),
  id_empresa: schema.number(),
};
export default class SecuritiesController {
  public async createGroup({ request, response }: HttpContextContract) {
    await request.validate({ schema: schema.create(GrupoSchema) });

    let dados = request.body();

    await SecurityGroup.create({
      nome: dados.nome,
      itens: dados.itens,
      id_empresa: dados.id_empresa,
    });
    response.json({ sucess: "Criado com sucesso" });
  }

  public async getGroupById({ request, auth }: HttpContextContract) {
    await request.validate({
      schema: schema.create({ id_grupo: schema.number() }),
    });
    let dados = request.body();
    if (auth.user)
      return await SecurityGroup.query()
        .select("*")
        .where("id_grupo", dados.id_grupo)
        .where("id_empresa", auth.user.id_empresa);
  }

  public async getAllGroups({ auth }: HttpContextContract) {
    if (auth.user)
      return await SecurityGroup.query()
        .select("id_grupo")
        .select("nome")
        .select("itens")
        .where("id_empresa", auth.user.id_empresa);
  }

  public async updateGroup({ request, response }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        id_grupo: schema.number(),
        nome: schema.string.nullableAndOptional(),
        itens: schema.string(),
      }),
    });
    let dados = request.body();
    let grupo = await SecurityGroup.findBy("id_grupo", dados.id_grupo);

    if (grupo) {
      grupo.merge(dados);
      await grupo.save();
      response.json({ sucess: "Atualizado com sucesso" });
    } else {
      response.json({ error: "Grupo não encontrado" });
    }
  }

  public async createGroupUser({ request, response }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        id_grupo: schema.number(),
        id_usuario: schema.number(),
        id_empresa: schema.number(),
      }),
    });

    let dados = request.body();

    await SecurityGroupUser.create({
      id_grupo: dados.id_grupo,
      id_usuario: dados.id_usuario,
      id_empresa: dados.id_empresa,
    });
    response.json({ sucess: "Cadastrado com sucesso" });
  }

  public async getGroupUserById({ request, response }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        id_usuario_grupo: schema.number(),
      }),
    });
    let dados = request.body();
    let query = await Database.rawQuery(`
            SELECT
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            WHERE id_usuario_grupo = '${dados.id_usuario_grupo}'
            ORDER BY g.nome
        `);
    response.json(query.rows);
  }

  public async getGroupUserByIdUser({ response, auth }: HttpContextContract) {
    let query = await Database.rawQuery(`
            SELECT
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            WHERE ug.id_usuario = '${auth.user?.id_usuario}'
            ORDER BY g.nome
        `);
    response.json(query.rows);
  }

  public async getAllGroupsUser({ response }: HttpContextContract) {
    let query = await Database.rawQuery(`
            SELECT
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            ORDER BY g.nome
        `);
    response.json(query.rows);
  }

  public async updateGroupUser({ request, response }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        id_usuario_grupo: schema.number(),
        id_grupo: schema.number(),
        id_usuario: schema.number(),
      }),
    });
    let dados = request.body();
    let groupUser = await SecurityGroupUser.findBy(
      "id_usuario_grupo",
      dados.id_usuario_grupo
    );

    if (groupUser) {
      groupUser.merge(dados);
      groupUser.save();
      response.json({ sucess: "Atualizado com sucesso" });
    } else {
      response.json({ error: "Não encontrado" });
    }
  }
}
