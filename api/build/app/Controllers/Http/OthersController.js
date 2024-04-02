"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
const BASE_URL_SP_TRANS = "https://api.olhovivo.sptrans.com.br/v2.1";
const TOKEN = "89280465aae637ace9e666d35a0eb2b16ecdb69860571245ef8c2ae5270b75d3";
const api = axios_1.default.create({
    baseURL: BASE_URL_SP_TRANS,
    timeout: 10000,
});
class OthersController {
    async getEnterpriseId(auth) {
        const params = await Database_1.default.connection("pg").rawQuery(`
                    select spt_empresa from ml_pla_parametro where id_empresa = '${auth.user?.id_empresa}'
                `);
        return params.rows[0].spt_empresa;
    }
    async getPositions({ response, auth }) {
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
        }
        catch (error) {
            response.badRequest({ error: "Erro interno 2" });
        }
    }
}
exports.default = OthersController;
//# sourceMappingURL=OthersController.js.map