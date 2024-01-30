import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Database from "@ioc:Adonis/Lucid/Database";

export default class DepartamentosController {
  public async list({ response, auth }: HttpContextContract) {
    if (!auth.user?.id_empresa) {
      return response.json({ message: "Usuário não pertence a uma empresa" });
    }

    let result = await Database.connection("pg")
      .from("ml_ctr_programa_area")
      .select("*")
      .where("solicitacao", "=", "1")
      .where("id_empresa", auth.user.id_empresa);

    response.json(result);
  }

  public async list_area_departamento({
    request,
    response,
  }: HttpContextContract) {
    let id_area = request.body().id_area;
    let result;

    if (id_area) {
      result = await Database.connection("pg")
        .from("ml_ctr_programa_area_modulo")
        .select("*")
        .where("id_area", "=", id_area)
        .where("solicitacao", "=", "1");
    }

    response.json(result);
  }
}
