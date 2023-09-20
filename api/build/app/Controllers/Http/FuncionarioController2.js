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
const Funcao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcao"));
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const date_fns_1 = require("date-fns");
class FuncionariosController2 {
    constructor() {
        this.getEmployeeFunction = async (id_funcao, id_empresa) => {
            let queryFuncao = await Funcao_1.default.query()
                .where("id_empresa", id_empresa)
                .where("id_funcao_erp", id_funcao);
            return queryFuncao ? queryFuncao[0] : null;
        };
        this.isMonthFreedom = async (id_empresa, id_pdf, mes) => {
            const liberacaoPdf = await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_flp_liberacao_recibos 
            where tipo_id = ${id_pdf} 
            AND bloqueio_liberacao = false
            AND mes_liberado = ${mes}
            AND empresa_id = ${id_empresa}
            `);
            return liberacaoPdf?.rows ? true : false;
        };
        this.getFotCard = async (id_funcionario_erp, periodoInicial, periodoFinal) => {
            const query = await Database_1.default.connection("oracle").rawQuery(`
        SELECT DISTINCT
        F.ID_FUNCIONARIO_ERP,
        F.REGISTRO,
        to_char(F.DATA_MOVIMENTO,'DD-MM-YYYY') as DATA_MOVIMENTO,
        TRIM(F.OCORRENCIA) AS OCORRENCIA,
        NVL(F.ENTRADA, '--------') AS ENTRADA,
        NVL(F.I_INI, '--------') AS I_INI,
        NVL(F.I_FIM, '--------') AS I_FIM,
        NVL(F.SAIDA, '--------') AS SAIDA,
        NVL(F.TABELA, '--------') AS TABELA,
        F.CODOCORR,
        NVL(F.NORMAL, '--------') AS NORMAL,
        NVL(F.EXTRA, '--------') AS EXTRA,
        NVL(F.OUTRA, '--------') AS OUTRA,
        NVL(F.A_NOT, '--------') AS A_NOT,
        NVL(F.BD_DEBITO, '--------') AS BD_DEBITO,
        NVL(F.BH_CREDITO, '--------') AS BH_CREDITO,
        TRIM(F.EXTRANOTDM) AS EXTRANOTDM,
        TRIM(F.TOTAL) AS TOTALF,
        F.BH_COMPETENCIA,
        TRIM(F.CREDITO) AS CREDITO,
        TRIM(F.DEBITO) AS DEBITO,
        TRIM(F.SALDOANTERIOR) AS SALDOANTERIOR,
        TRIM(F.VALORPAGO) AS VALORPAGO,
        TRIM(F.SALDOATUAL) AS SALDOATUAL
        FROM VW_ML_PON_FICHAPONTO F
        WHERE ID_FUNCIONARIO_ERP = '${id_funcionario_erp}'
        AND DATA_MOVIMENTO BETWEEN to_date('${periodoInicial}','DD-MM-YYYY') and to_date('${periodoFinal}','DD-MM-YYYY')
        ORDER BY BH_COMPETENCIA
    `);
            return query;
        };
        this.getResumeDotCard = async (id_funcionario_erp, competencia) => {
            const resumoFicha = await Database_1.default.connection("oracle").rawQuery(`
        SELECT DISTINCT EVENTO, TRIM(HR_DIA) as HR_DIA
        FROM VW_ML_PON_RESUMO_HOLERITE FH
        WHERE FH.ID_FUNCIONARIO_ERP = '${id_funcionario_erp}'
        AND FH.COMPETENCIA = '${(0, date_fns_1.format)(competencia, "MM/yyyy")}'
    `);
            return resumoFicha;
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
    tratarDadosDotCard(dados, dados_empresa, funcionario, data, resumoFicha, funcao) {
        const ultimaPosicao = dados.length - 1;
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                nomeEmpresa: dados_empresa.nomeempresarial,
                cnpj: dados_empresa.cnpj,
                nome: funcionario.nome,
                funcao: funcao,
                competencia: data,
                endereco: dados_empresa.logradouro,
                periodo: data.split("").reverse().join(""),
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
    async dotCardPdfGenerator({ request, response, auth }) {
        try {
            let dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const data = dados.data.split("-");
            const periodoInicial = `27-${data[1] - 1}-${data[0]}`;
            const periodoFinal = `26-${data[1]}-${data[0]}`;
            const competencia = new Date(data[0], data[1] - 1, 26);
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 1, data);
            if (!liberacaoPdf) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            let appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            let query = await this.getFotCard(funcionario?.id_funcionario_erp, periodoInicial, periodoFinal);
            let resumoFicha = await this.getResumeDotCard(funcionario?.id_funcionario_erp, competencia);
            let empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            const funcao = await this.getEmployeeFunction(auth.user?.id_empresa, funcionario.id_funcao_erp);
            let pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query, empresa, funcionario, `${data[1]}-${data[0]}`, resumoFicha, funcao), template_1.fichaPonto);
            let confirmacao = await ConfirmarPdf_1.default.query()
                .select("*")
                .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                .andWhere("data_pdf", "=", `${dados.data}`);
            let file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (file) {
                fs_1.default.unlink(pdfTemp.filename, () => { });
                response.json({
                    pdf: file.Location,
                    confirmado: confirmacao[0] ? true : false,
                });
            }
        }
        catch (error) {
            console.log(error);
            response.badRequest(error);
        }
    }
}
exports.default = FuncionariosController2;
//# sourceMappingURL=FuncionarioController2.js.map