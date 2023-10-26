"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://endpointsambaiba.ml18.com.br/glo/pontoeletronico";
const api = axios_1.default.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
async function RequestFichaPonto(id_funcionario_erp, dateRequestInitial, dateRequestFinish) {
    try {
        const { data } = await api.post("/ficha", {
            ID_FUNCIONARIO_ERP: id_funcionario_erp,
            dt_movimento_inicio: dateRequestInitial,
            dt_movimento_fim: dateRequestFinish,
        });
        return data;
    }
    catch (err) {
        const { error } = err?.response?.data;
        throw new Error(error);
    }
}
exports.default = RequestFichaPonto;
//# sourceMappingURL=RequestFicha.js.map