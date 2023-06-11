import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";

const BASE_URL_SPTRANS = "http://api.olhovivo.sptrans.com.br/v2.1";
const TOKEN = "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";

const api = axios.create({
  baseURL: BASE_URL_SPTRANS,
});

export default class OthersController {

    private async activateToken()
    {
        const url = `/Login/Autenticar?token=${TOKEN}`;
        const data = await api.post(url);
        return data.data;
    }

    public async getPosicao({
        request,
        response,
        auth,
      }: HttpContextContract) {
        try {
            const data = await this.activateToken();
            if (data == true) {
                let params = await Database.connection("pg").rawQuery(`
                    select spt_empresa from ml_pla_parametro where id_empresa = '${auth.user?.id_empresa}'
                `);
                let id_empresa = params.rows[0].spt_empresa;
                id_empresa = 50;

                const url = `/Posicao/Garagem?codigoEmpresa=${id_empresa}`;
                const dados = await api.get(url);
                return dados.data;
            }
            return [];

        } catch (error) {
            response.badRequest({error : 'Erro interno'});
        }
    }

    
}
