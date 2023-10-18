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
    formatDate(date) {
        return luxon_1.DateTime.fromISO(date).toFormat("dd/LL/yyyy").toString();
    }
    generateRequestDates(dados) {
        const lastDayOfMonth = `${dados.data.year}/${dados.data.month}/27`;
        const dateRequestInitial = this.formatDate(luxon_1.DateTime.fromISO(lastDayOfMonth).minus({ months: 1 }).toJSDate());
        const dateRequestFinish = this.formatDate(luxon_1.DateTime.fromISO(lastDayOfMonth).toJSDate());
        return { dateRequestInitial, dateRequestFinish };
    }
    async dotCardPdfGenerator({ request, response, auth, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const competencia = `${dados.data.month}/${dados.data.year}`;
            const { dateRequestInitial, dateRequestFinish } = this.generateRequestDates(dados);
            const [isMonthReleased, funcionario, appUpdate, empresa] = await Promise.all([
                this.isMonthFreedom(auth.user?.id_empresa, 1, competencia),
                Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario),
                AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario),
                Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa),
            ]);
            if (!isMonthReleased || !funcionario || !appUpdate || !empresa) {
                return response.badRequest({
                    error: "Ocorreu um erro ao tentar gerar o pdf!",
                });
            }
            const query = await Database_1.default.connection("oracle").rawQuery(`
        SELECT DISTINCT *
          FROM GUDMA.VW_ML_FICHAPONTO_PDF F
          WHERE F.ID_FUNCIONARIO_ERP = '${funcionario.id_funcionario_erp}'
          AND F.DATA_MOVIMENTO BETWEEN '${dateRequestInitial}' AND '${dateRequestFinish}'
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
            if (!pdfTemp) {
                return response.badRequest({ error: "Erro ao gerar pdf!" });
            }
            const confirmacao = await ConfirmarPdf_1.default.query()
                .select("*")
                .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                .andWhere("data_pdf", "=", `${dados.data}`);
            if (!confirmacao) {
                return response.badRequest({ error: "Erro ao verificar confirmação!" });
            }
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file) {
                return response.badRequest({ error: "Erro ao fazer upload de pdf!" });
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
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map