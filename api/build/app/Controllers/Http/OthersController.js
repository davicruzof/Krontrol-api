"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
const BASE_URL_SPTRANS = "http://api.olhovivo.sptrans.com.br/v2.1";
const TOKEN = "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";
const api = axios_1.default.create({
    baseURL: BASE_URL_SPTRANS,
});
class OthersController {
    async activateToken() {
        const url = `/Login/Autenticar?token=${TOKEN}`;
        const data = await api.post(url);
        return data.data;
    }
    async getPosicao({ request, response, auth, }) {
        try {
            const data = await this.activateToken();
            if (data == true) {
                let params = await Database_1.default.connection("pg").rawQuery(`
                    select spt_empresa from ml_pla_parametro where id_empresa = '${auth.user?.id_empresa}'
                `);
                let id_empresa = params.rows[0].spt_empresa;
                id_empresa = 50;
                const url = `/Posicao/Garagem?codigoEmpresa=${id_empresa}`;
                const dados = await api.get(url);
                return dados.data;
            }
            return [];
        }
        catch (error) {
            response.badRequest({ error: 'Erro interno' });
        }
    }
}
exports.default = OthersController;
//# sourceMappingURL=OthersController.js.map