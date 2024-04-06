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
    async searchVehicle({ response, auth, request }) {
        try {
            const { prefix } = request.body();
            if (!prefix) {
                response.badRequest({ error: "Prefixo não informado" });
            }
            const id_empresa = await this.getEnterpriseId(auth);
            const resultAuth = await api.post(`/Login/Autenticar?token=${TOKEN}`);
            if (resultAuth.data) {
                const positionsGarage = await this.getPositionsGarage(resultAuth, id_empresa, +prefix);
                if (positionsGarage !== null) {
                    return response.json({
                        positions: positionsGarage,
                        success: true,
                    });
                }
                else {
                    const positionsStreet = await this.getPositionsStreet(resultAuth, id_empresa, +prefix);
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
        }
        catch (error) {
            response.badRequest({ error: "Erro interno 2" });
        }
    }
    async getPositionsGarage(resultAuth, id_empresa, prefix) {
        try {
            const data = await this.getListPrefix(resultAuth, id_empresa, "garage");
            if (data) {
                const result = this.searchPrefix(prefix, data.l);
                return result.linha ? result : null;
            }
            return null;
        }
        catch (error) {
            return error;
        }
    }
    async getPositionsStreet(resultAuth, id_empresa, prefix) {
        try {
            const data = await this.getListPrefix(resultAuth, id_empresa, "street");
            if (data) {
                const result = this.searchPrefix(prefix, data.l);
                return result.linha ? result : null;
            }
            return null;
        }
        catch (error) {
            return error;
        }
    }
    async getListPrefix(resultAuth, id_empresa, type) {
        const url = type === "street" ? "/Posicao" : "/Posicao/Garagem";
        const { data } = await api.get(`${url}?codigoEmpresa=${id_empresa}`, {
            headers: {
                Cookie: resultAuth.headers["set-cookie"],
            },
        });
        return data;
    }
    searchPrefix(prefix, items) {
        let result = {};
        items.map((item) => {
            item.vs.filter((v) => {
                if (v.p === prefix) {
                    result = {
                        linha: item.c,
                        prefixo: v.p,
                        sentido: item.sl,
                        data: this.formatDate(v.ta),
                        coordinates: {
                            latitude: v.py,
                            longitude: v.px,
                        },
                    };
                }
            });
        });
        return result;
    }
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}
exports.default = OthersController;
//# sourceMappingURL=OthersController.js.map