"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const ConfirmarPdf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ConfirmarPdf"));
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const fs_1 = __importDefault(require("fs"));
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const luxon_1 = require("luxon");
const template_ficha_ponto_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/template_ficha_ponto");
const RequestFicha_1 = __importDefault(require("./RequestFicha"));
class DotCardPdf {
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
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                type: "pdf",
            };
            const filename = Math.random() + "_doc" + ".pdf";
            var document = {
                html: template,
                data: {
                    dados: dados,
                },
                path: "./pdfsTemp/" + filename,
            };
            let file = pdf_creator_node_1.default
                .create(document, options)
                .then((res) => {
                return res;
            })
                .catch((error) => {
                return error;
            });
            return await file;
        }
        catch (error) { }
    }
    tratarDadosDotCard(dados, dados_empresa, resumoFicha, competencia) {
        const ultimaPosicao = dados.length - 1;
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                nomeEmpresa: dados_empresa.nomeempresarial,
                cnpj: dados_empresa.cnpj,
                nome: dados[ultimaPosicao].NOME,
                funcao: dados[ultimaPosicao].FUNCAO,
                competencia: competencia,
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
    getLastDayOfMonth(year, month) {
        const dt = luxon_1.DateTime.local(year, month);
        const lastDay = dt.endOf("month").day;
        return lastDay;
    }
    async dotCardPdfGenerator({ request, response, auth, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({
                    error: "Não foi possivel consultar sua ficha ponto!",
                });
            }
            const data = `${dados.data.year}/${dados.data.month}`;
            const competencia = `${dados.data.month}/${dados.data.year}`;
            const firstDay = "01";
            let lastDay = this.getLastDayOfMonth(+dados.data.year, +dados.data.month);
            let dateRequestInitial = luxon_1.DateTime.fromISO(new Date(`${data}/${firstDay}`).toISOString().replace(".000Z", ""))
                .toFormat("dd-LL-yyyy")
                .toString();
            let dateRequestFinish = luxon_1.DateTime.fromISO(new Date(`${data}/${lastDay}`).toISOString().replace(".000Z", ""))
                .toFormat("dd-LL-yyyy")
                .toString();
            if (+dados.data.year < 2024 ||
                (+dados.data.year === 2024 && +dados.data.month < 2)) {
                dateRequestInitial = luxon_1.DateTime.fromISO(new Date(`${data}/27`).toISOString().replace(".000Z", ""))
                    .minus({ months: 1 })
                    .toFormat("dd-LL-yyyy")
                    .toString();
                dateRequestFinish = luxon_1.DateTime.fromISO(new Date(`${data}/26`).toISOString().replace(".000Z", ""))
                    .toFormat("dd-LL-yyyy")
                    .toString();
            }
            if (competencia === "02/2024") {
                dateRequestInitial = luxon_1.DateTime.fromISO(new Date(`${data}/27`).toISOString().replace(".000Z", ""))
                    .toFormat("dd-LL-yyyy")
                    .toString();
                dateRequestFinish = luxon_1.DateTime.fromISO(new Date(`${data}/29`).toISOString().replace(".000Z", ""))
                    .toFormat("dd-LL-yyyy")
                    .toString();
            }
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
                return response.badRequest({ error: "O seu app desatualizado!" });
            }
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            const query = await (0, RequestFicha_1.default)(funcionario.id_funcionario_erp, dateRequestInitial, dateRequestFinish);
            if (query.length === 0) {
                return response.badRequest({
                    error: "Não foi possivel gerar a sua ficha ponto! Tente novamente mais tarde",
                });
            }
            const formattedData = query.map((obj) => {
                Object.keys(obj).forEach((key) => {
                    if (obj[key] === null) {
                        obj[key] = "--------";
                    }
                });
                return obj;
            });
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
            const pdfTemp = await this.generatePdf(this.tratarDadosDotCard(formattedData, empresa, resumoFicha, competencia), template_ficha_ponto_1.Template_Ficha_Ponto);
            if (!pdfTemp) {
                return response.badRequest({ error: "Erro ao gerar pdf!" });
            }
            const confirmacao = await ConfirmarPdf_1.default.query()
                .select("*")
                .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                .andWhere("data_pdf", "=", `${data}`);
            if (!confirmacao) {
                return response.badRequest({ error: "Erro ao verificar confirmação!" });
            }
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({
                pdf: file.Location,
                confirmado: confirmacao[0] ? true : false,
            });
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = DotCardPdf;
//# sourceMappingURL=DotCardPdf.js.map