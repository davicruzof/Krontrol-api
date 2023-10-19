"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const template_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/template");
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const luxon_1 = require("luxon");
class Receipts2 {
    constructor() {
        this.isMonthFreedom = async (id_empresa, id_pdf, mes) => {
            const liberacaoPdf = await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_flp_liberacao_recibos 
            where tipo_id = ${id_pdf} 
            AND bloqueio_liberacao = false
            AND mes_liberado = '${mes}'
            AND empresa_id = ${id_empresa}
            `);
            return liberacaoPdf?.rows.length > 0 ? true : false;
        };
    }
    async generatePdf(dados, template) {
        try {
            const filename = Math.random() + "_doc" + ".pdf";
            var document = {
                html: template,
                data: {
                    dados: dados,
                },
                path: "./pdfsTemp/" + filename,
            };
            return document;
        }
        catch (error) { }
    }
    tratarDadosDotCard(dados, dados_empresa, resumoFicha) {
        const ultimaPosicao = dados.length - 1;
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                nomeEmpresa: dados_empresa.nomeempresarial,
                cnpj: dados_empresa.cnpj,
                nome: dados[ultimaPosicao].NOME,
                funcao: dados[ultimaPosicao].FUNCAO,
                competencia: dados[ultimaPosicao].BH_COMPETENCIA,
                endereco: dados_empresa.logradouro,
            },
            rodape: {
                saldoAnterior: dados[ultimaPosicao].SALDOANTERIOR,
                credito: dados[ultimaPosicao].CREDITO,
                debito: dados[ultimaPosicao].DEBITO,
                valorPago: dados[ultimaPosicao].VALORPAGO,
                saldoAtual: dados[ultimaPosicao].SALDOATUAL,
            },
            dadosDias: new Array(),
            resumo: resumoFicha,
        };
        dados.forEach((element) => {
            element.TOTALF = element.TOTALF;
            element.EXTRA = element.EXTRA;
            element.OUTRA = element.OUTRA;
            dadosTemp.dadosDias.push(element);
        });
        return dadosTemp;
    }
    async dotCardPdfGenerator({ request, response, auth, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const data = `${dados.data.year}/${dados.data.month}`;
            const competencia = `${dados.data.month}/${dados.data.year}`;
            const dateRequestInitial = luxon_1.DateTime.fromISO(new Date(`${data}-27`).toISOString().replace(".000Z", ""))
                .minus({ months: 1 })
                .toFormat("dd/LL/yyyy")
                .toString();
            const dateRequestFinish = luxon_1.DateTime.fromISO(new Date(`${data}-26`).toISOString().replace(".000Z", ""))
                .toFormat("dd/LL/yyyy")
                .toString();
            const isMonthReleased = await this.isMonthFreedom(auth.user?.id_empresa, 1, competencia);
            if (!isMonthReleased) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            const appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            const query = await Database_1.default.connection("oracle").rawQuery(`
        SELECT DISTINCT *
          FROM GUDMA.VW_ML_FICHAPONTO_PDF F
          WHERE F.ID_FUNCIONARIO_ERP = '${funcionario.id_funcionario_erp}'
          AND F.DATA_MOVIMENTO BETWEEN to_date('${dateRequestInitial}','DD-MM-YYYY') and to_date('${dateRequestFinish}','DD-MM-YYYY')
          ORDER BY F.DATA_MOVIMENTO
      `);
            let resumoFicha = [];
            try {
                resumoFicha = await Database_1.default.connection("oracle").rawQuery(`
          SELECT DISTINCT EVENTO, TRIM(HR_DIA) as HR_DIA
          FROM
            VW_ML_PON_RESUMO_HOLERITE FH
          WHERE FH.ID_FUNCIONARIO_ERP = '${funcionario?.id_funcionario_erp}'
          AND FH.COMPETENCIA = '${competencia}'
        `);
            }
            catch (error) {
                resumoFicha = [];
            }
            const pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query, empresa, resumoFicha), template_1.fichaPonto);
            return response.json({ pdfTemp });
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map