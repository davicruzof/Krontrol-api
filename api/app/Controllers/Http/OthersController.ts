import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";

const BASE_URL_SP_TRANS = "https://api.olhovivo.sptrans.com.br/v2.1";

const TOKEN =
  "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";

const api = axios.create({
  baseURL: BASE_URL_SP_TRANS,
  timeout: 10000,
});

export default class OthersController {
  private async getEnterpriseId(auth: AuthContract) {
    const params = await Database.connection("pg").rawQuery(`
                    select spt_empresa from ml_pla_parametro where id_empresa = '${auth.user?.id_empresa}'
                `);
    return params.rows[0].spt_empresa;
  }

  public async getPositions({ response, auth }: HttpContextContract) {
    try {
      const id_empresa = await this.getEnterpriseId(auth);

      const resultAuth = await api.post(`/Login/Autenticar?token=${TOKEN}`);

      if (resultAuth.data) {
        const dados = await api.get(
          `/Posicao/Garagem?codigoEmpresa=${id_empresa}`,
          {
            headers: {
              Cookie: resultAuth.headers["set-cookie"],
            },
          }
        );

        return dados.data;
      }
      return [];
    } catch (error) {
      response.badRequest({ error: "Erro interno 2" });
    }
  }
}
