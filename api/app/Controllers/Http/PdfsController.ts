import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class PdfsController {
  public async upload({ request, response }: HttpContextContract) {
    const files = request.files("files");
    return files;
  }

  public async getConfirmedsById({ request, response }: HttpContextContract) {
    const id = request.body().id;
    if (id) {
      let dados = await Database.connection("pg").rawQuery(`
                SELECT c.*, f.nome,f.id_funcionario_erp,f.id_empresa,f.registro
                FROM ml_pdf_confirmed c
                INNER JOIN ml_fol_funcionario f on (c.id_funcionario = f.id_funcionario)
                WHERE c.id_pdf_confirmed = '${id}'
            `);

      response.json(dados.rows);
    } else {
      response.badRequest({ error: "Erro interno" });
    }
  }

  public async getAllConfirmeds({ request, response }) {
    let dados = await Database.connection("pg").rawQuery(`
                SELECT c.*, to_char(c.data_cadastro, 'DD/MM/YYYY HH24:MM:SS') as data_cadastro, f.nome,f.id_funcionario_erp,f.id_empresa,f.registro
                FROM ml_pdf_confirmed c
                INNER JOIN ml_fol_funcionario f on (c.id_funcionario = f.id_funcionario)
                ORDER BY c.id_pdf_confirmed
            `);
    response.json(dados.rows);
  }
}
