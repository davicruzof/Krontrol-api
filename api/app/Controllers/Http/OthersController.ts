import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import axios, { AxiosResponse } from "axios";

const BASE_URL_SP_TRANS = "https://api.olhovivo.sptrans.com.br/v2.1";

const TOKEN =
  "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";

const api = axios.create({
  baseURL: BASE_URL_SP_TRANS,
  timeout: 10000,
});

export interface RootInterface {
  c: string;
  cl: number;
  sl: number;
  lt0: string;
  lt1: string;
  qv: number;
  vs: V[];
}

export interface V {
  p: number;
  a: boolean;
  ta: string;
  py: number;
  px: number;
  sv?: any;
  is?: any;
}

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
        const dados = await api.get(`/Posicao?codigoEmpresa=${id_empresa}`, {
          headers: {
            Cookie: resultAuth.headers["set-cookie"],
          },
        });

        return dados.data;
      }
      return [];
    } catch (error) {
      response.badRequest({ error: "Erro interno 2" });
    }
  }

  public async searchVehicle({ response, auth, request }: HttpContextContract) {
    try {
      const { prefix } = request.body();

      if (!prefix) {
        response.badRequest({ error: "Prefixo não informado" });
      }

      const id_empresa = await this.getEnterpriseId(auth);

      const resultAuth = await api.post(`/Login/Autenticar?token=${TOKEN}`);

      if (resultAuth.data) {
        const positionsGarage = await this.getPositionsGarage(
          resultAuth,
          id_empresa,
          +prefix
        );

        if (positionsGarage !== null) {
          return response.json({
            positions: positionsGarage,
            success: true,
          });
        } else {
          const positionsStreet = await this.getPositionsStreet(
            resultAuth,
            id_empresa,
            +prefix
          );

          if (positionsStreet !== null) {
            return response.json({
              positions: positionsStreet,
              success: true,
            });
          }
        }

        return response.json({
          success: false,
          errorMessage: "Prefixo não encontrado",
        });
      }

      return response.json({
        success: false,
      });
    } catch (error) {
      response.badRequest({ error: "Erro interno 2" });
    }
  }

  public async getPositionsGarage(
    resultAuth: AxiosResponse<any, any>,
    id_empresa: number,
    prefix: number
  ) {
    try {
      const data = await this.getListPrefix(resultAuth, id_empresa, "garage");
      if (data) {
        const result = this.searchPrefix(prefix, data.l);

        return result?.a ? result : null;
      }

      return null;
    } catch (error) {
      return error;
    }
  }

  public async getPositionsStreet(
    resultAuth: AxiosResponse<any, any>,
    id_empresa: number,
    prefix: number
  ) {
    try {
      const data = await this.getListPrefix(resultAuth, id_empresa, "street");

      if (data) {
        const result = this.searchPrefix(prefix, data.l);

        return result?.a ? result : null;
      }

      return null;
    } catch (error) {
      return error;
    }
  }

  private async getListPrefix(
    resultAuth: AxiosResponse<any, any>,
    id_empresa: number,
    type: "street" | "garage"
  ) {
    const url = type === "street" ? "/Posicao" : "/Posicao/Garagem";
    const { data } = await api.get(`${url}?codigoEmpresa=${id_empresa}`, {
      headers: {
        Cookie: resultAuth.headers["set-cookie"],
      },
    });

    return data;
  }

  private searchPrefix(prefix: number, items: RootInterface[]): V {
    let result: V = {} as V;
    items.map((item) => {
      item.vs.filter((v) => {
        if (v.p === prefix) {
          result = v;
        }
      });
    });

    return result;
  }
}
