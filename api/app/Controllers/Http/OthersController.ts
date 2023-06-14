import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";

const BASE_URL_SP_TRANS = "http://api.olhovivo.sptrans.com.br/v2.1";

const TOKEN =
  "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";

const api = axios.create({
  baseURL: BASE_URL_SP_TRANS,
  timeout: 10000,
  headers: {
    Cookie:
      "apiCredentials=ADD73F58F18CDEBAEE5538FFF8B08683F5F486076647976F0D8980C8324F7E34C592388DDA1CB9D95738D310B8D0EF0FA39E43B0B7FE699039BB3246816C65875A9464345A0128604AAE4452B4EAA4476E34692C8BFA5C8FF791749EB580BF0C45BAE8394D1AB28AC5FD40E55F5143DD86D1E37EE31F2B8491C4DA615ADC6154E87E15ED74FE6722BC1F9C1A70C41695C9CA2D5F0EED67472AC5479EF5C5B7F61030FDAC546848B818B218B1C3B2697F82A17D992C371EB7C105390EB7AF26B063BE6E71",
  },
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

      await api.post(`/Login/Autenticar?token=${TOKEN}`);

      const dados = await api.get(
        `/Posicao/Garagem?codigoEmpresa=${id_empresa}`
      );

      return dados.data;
    } catch (error) {
      response.badRequest({ error: "Erro interno 2" });
    }
  }
}
