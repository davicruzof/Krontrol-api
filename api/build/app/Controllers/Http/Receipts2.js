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
    tratarDadosDotCard(dados, dados_empresa, data, resumoFicha) {
        const ultimaPosicao = dados.length - 1;
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                nomeEmpresa: dados_empresa.nomeempresarial,
                cnpj: dados_empresa.cnpj,
                nome: dados[ultimaPosicao].NOME,
                funcao: dados[ultimaPosicao].FUNCAO,
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
    tratarDadosEvents(dados, dados_empresa) {
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                telefone: dados_empresa.telefone,
                nomeEmpresa: dados[0].RSOCIALEMPRESA,
                inscricaoEmpresa: dados[0].INSCRICAOEMPRESA,
                matricula: dados[0].registro,
                nome: dados[0].NOMEFUNC,
                funcao: dados[0].DESCFUNCAO,
                competencia: dados[0].COMPETFICHA,
                endereco: {
                    rua: dados[0].ENDERECOFL,
                    cidade: dados[0].CIDADEFL,
                    estado: dados[0].IESTADUALFL,
                    numero: dados[0].NUMEROENDFL,
                    complemento: dados[0].COMPLENDFL,
                },
            },
            totais: {
                DESCONTOS: 0,
                PROVENTOS: 0,
                LIQUIDO: 0,
            },
            bases: {
                BASE_FGTS_FOLHA: 0,
                BASE_INSS_FOLHA: 0,
                FGTS_FOLHA: 0,
                BASE_IRRF_FOLHA: 0,
            },
            descricao: new Array(),
        };
        dados.forEach((element) => {
            if (element.DESCEVEN == "BASE FGTS FOLHA") {
                dadosTemp.bases.BASE_FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "FGTS FOLHA") {
                dadosTemp.bases.FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE IRRF FOLHA") {
                dadosTemp.bases.BASE_IRRF_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE INSS FOLHA") {
                dadosTemp.bases.BASE_INSS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE DESCONTOS") {
                dadosTemp.totais.DESCONTOS = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE PROVENTOS") {
                dadosTemp.totais.PROVENTOS = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "LIQUIDO DA FOLHA") {
                dadosTemp.totais.LIQUIDO = element.VALORFICHA;
            }
            else if (element.TIPOEVEN != "B") {
                if (element.VALORFICHA[0] == ",") {
                    element.VALORFICHA = "0" + element.VALORFICHA;
                }
                element.VALORFICHA = element.VALORFICHA.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                });
                if (element.REFERENCIA != "") {
                    element.REFERENCIA = element.REFERENCIA.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                    });
                }
                dadosTemp.descricao.push(element);
            }
        });
        return dadosTemp;
    }
    async dotCardPdfGenerator({ request, response, auth, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const data = dados.data.split("-");
            if (data[1].includes("0")) {
                data[1] = data[1].replace("0", "");
            }
            const month = +data[1] > 9 ? data[1] : `0${data[1]}`;
            const competencia = `${month}/${data[0]}`;
            const dateRequestInitial = luxon_1.DateTime.fromISO(new Date(`${dados.data}-27`).toISOString().replace(".000Z", ""))
                .minus({ months: 1 })
                .toFormat("dd/LL/yyyy")
                .toString();
            const dateRequestFinish = luxon_1.DateTime.fromISO(new Date(`${dados.data}-26`).toISOString().replace(".000Z", ""))
                .toFormat("dd/LL/yyyy")
                .toString();
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 1, competencia);
            if (!liberacaoPdf) {
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
            SELECT DISTINCT
                fun.id_funcionario_erp,
                NVL(fun.funcao, '--------') AS FUNCAO,
                NVL(fun.nome, '--------') AS NOME,
                df.dtdigit AS DATA_MOVIMENTO,
                oco.descocorr AS OCORRENCIA,
                NVL(CASE
                    WHEN df.CODOCORR IN (2, 12, 81) THEN
                        REPLACE(REPLACE(REPLACE(TO_CHAR(df.entradigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '10/11/2022 00:00:00', ''), '00:00', '')
                    ELSE
                        REPLACE(REPLACE(TO_CHAR(df.entradigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '10/11/2022 00:00:00', '')
                END, '--------') AS ENTRADA,
                NVL(CASE
                    WHEN df.CODOCORR IN (2, 12, 81) THEN
                        REPLACE(REPLACE(TO_CHAR(df.intidigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '00:00', '')
                    ELSE
                        REPLACE(TO_CHAR(df.intidigit, 'HH24:MI'), '30/12/1899 00:00:00', '')
                END,'--------') AS I_INI,
                NVL(CASE
                    WHEN df.CODOCORR IN (2, 12, 81) THEN
                        REPLACE(REPLACE(TO_CHAR(df.intfdigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '00:00', '')
                    ELSE
                        REPLACE(TO_CHAR(df.intfdigit, 'HH24:MI'), '30/12/1899 00:00:00', '')
                END, '--------') AS I_FIM,
                NVL(CASE
                    WHEN df.CODOCORR IN (2, 12, 81) THEN
                        REPLACE(REPLACE(TO_CHAR(df.saidadigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '00:00', '')
                    ELSE
                        REPLACE(TO_CHAR(df.saidadigit, 'HH24:MI'), '30/12/1899 00:00:00', '')
                END, '--------') AS SAIDA,
                NVL(lin.codigolinha, '--------') AS LINHA,
                NVL(df.servicodigit, '--------') AS TABELA,
                df.codocorr,
                NVL(CASE
                    WHEN df.CODOCORR IN (1, 5, 13, 31, 81, 85) THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(CASE WHEN df.CODOCORR IN (1, 5, 13, 31, 81, 85) THEN df.normaldm END, '999999990D99')), '.', ':')
                END, '--------') AS NORMAL,
                NVL(CASE
                    WHEN df.outradm > 0 THEN
                        '' || REPLACE(LTRIM(TO_CHAR(df.outradm, '')), '#', ':')
                END, '--------') AS OUTRA,
                NVL(CASE
                    WHEN df.adnotdm > 0 THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(df.adnotdm, '999999990D99')), '.', ':')
                END, '--------') AS A_NOT,
                NVL(CASE
                    WHEN df.CODOCORR IN (2) THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(CASE WHEN df.CODOCORR IN (2) THEN df.normaldm END, '999999990D99')), '.', ':')
                END, '--------') AS dsr,
                NVL(TO_CHAR(df.extranotdm, '999999990D99'), '--------') AS EXTRANOTDM,
                NVL(CASE
                    WHEN df.CODOCORR NOT IN (14, 28, 104) THEN
                        TO_CHAR((df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm), '999999990D99')
                END, '--------') AS TOTALF,
                NVL(TO_CHAR(bh.competencia, 'MM/YYYY'), '--------') AS BH_COMPETENCIA,
                NVL(TO_CHAR(bh.credito, '999999900D99'), '--------') AS CREDITO,
                NVL(TO_CHAR(bh.debito, '999999900D99'), '--------') AS DEBITO,
                NVL(TO_CHAR(bh.saldoanterior, '999999900D99'), '--------') AS SALDOANTERIOR,
                NVL(TO_CHAR(bh.valorpago, '999999900D99'), '--------') AS VALORPAGO,
                NVL(SUBSTR(
                to_char(
                  to_char(
                    (( (SUBSTR(to_char( to_char(bh.saldoanterior,'999999900D99')),7,4 )*60) +
                      CASE
                        WHEN bh.saldoanterior < 0.00 THEN '-'||SUBSTR(to_char( to_char(bh.saldoanterior,'999999900D99')),12,2)
                        ELSE SUBSTR(to_char( to_char(bh.saldoanterior,'999999900D99')),12,2 ) END )+
                    ( (SUBSTR(to_char( to_char(bh.credito,'999999900D99')),7,4 )*60) +
                      CASE WHEN bh.credito < 0.00 THEN '-'||SUBSTR(to_char( to_char(bh.credito,'999999900D99')),12,2) ELSE SUBSTR(to_char( to_char(bh.credito,'999999900D99')),12,2 ) END ) -
            ( (SUBSTR(to_char( to_char(bh.valorpago,'999999900D99')),7,4 )*60) + CASE WHEN bh.debito < 0.00 THEN '-'||SUBSTR(to_char( to_char(bh.valorpago,'999999900D99')),12,2) ELSE SUBSTR(to_char( to_char(bh.valorpago,'999999900D99')),12,2 ) END ) -
            ( (SUBSTR(to_char( to_char(bh.debito,'999999900D99')),7,4 )*60) + CASE WHEN bh.debito < 0.00 THEN '-'||SUBSTR(to_char( to_char(bh.debito,'999999900D99')),12,2) ELSE SUBSTR(to_char( to_char(bh.debito,'999999900D99')),12,2 ) END )) / 60 ,'999999900D99')
            ,'999999900D99')
            ,1,11), '--------') AS SALDOATUAL,
                df.tipodigit,
                fun.CODFUNC AS registro,
                NVL(bhd.BD_DEBITO, '--------') AS BD_DEBITO,
                NVL(bhd.BH_CREDITO, '--------') AS BH_CREDITO
            FROM globus.FRQ_DIGITACAOMOVIMENTO df
            INNER JOIN VW_ML_FLP_FUNCIONARIO fun ON df.codintfunc = fun.id_funcionario_erp
            INNER JOIN globus.VW_BANCOHORAS bh ON df.codintfunc = bh.codintfunc
            INNER JOIN globus.FRQ_OCORRENCIA oco ON df.codocorr = oco.codocorr
            LEFT JOIN globus.BGM_CADLINHAS lin ON df.codintlinha = lin.codintlinha
            LEFT JOIN VW_ML_FRQ_BH_DIARIO bhd ON df.CODINTFUNC = bhd.CODINTFUNC AND bhd.DTDIGIT = df.DTDIGIT
            WHERE
                df.CODINTFUNC IN ('${funcionario.id_funcionario_erp}')
                AND df.dtdigit BETWEEN '${dateRequestInitial}' AND '${dateRequestFinish}'
                AND TO_CHAR(df.dtdigit, 'DD/MM/YYYY') = TO_CHAR(bh.competencia, 'DD/MM/YYYY')
                AND df.tipodigit = 'F'
                AND (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) > 0
                AND df.STATUSDIGIT = 'N'
      `);
            if (query.length === 0) {
                return response.badRequest({
                    error: "Nenhum dado de ficha ponto foi encontrado!",
                });
            }
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
            const pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query, empresa, `${data[1]}-${data[0]}`, resumoFicha), template_1.fichaPonto);
            if (!pdfTemp) {
                return response.badRequest({ error: "Erro ao gerar pdf!" });
            }
            const confirmacao = await ConfirmarPdf_1.default.query()
                .select("*")
                .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                .andWhere("data_pdf", "=", `${dados.data}`);
            if (!confirmacao) {
                return response.badRequest({ error: "Erro ao aplicar confirmação!" });
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
    async payStubPdfGenerator({ request, auth, response, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const data = dados.data.split("-");
            if (data[1].includes("0")) {
                data[1] = data[1].replace("0", "");
            }
            const month = +data[1] > 9 ? data[1] : `0${data[1]}`;
            const competencia = `${month}/${data[0]}`;
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 2, competencia);
            if (!liberacaoPdf) {
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
            let payStub = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'MM-YYYY') as COMPETFICHA,
                                    CODINTFUNC,
                                    to_char(VALORFICHA, 'FM999G999G999D90', 'nls_numeric_characters='',.''') AS VALORFICHA,
                                    REFERENCIA,
                                    NOMEFUNC,
                                    DESCEVEN,
                                    RSOCIALEMPRESA,
                                    INSCRICAOEMPRESA,
                                    DESCFUNCAO,
                                    CIDADEFL,
                                    IESTADUALFL,
                                    ENDERECOFL,
                                    NUMEROENDFL,
                                    COMPLENDFL,
                                    TIPOEVEN
                                    FROM  globus.vw_flp_fichaeventosrecibo hol
                                WHERE
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'MM/YYYY') = '${competencia}'
                                and hol.TIPOFOLHA = 1
                                order by hol.tipoeven desc,hol.desceven
                                `);
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            payStub[0].registro = funcionario?.registro;
            const pdfTemp = await this.generatePdf(this.tratarDadosEvents(payStub, empresa), template_1.templateDotCard);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file || !file.Location) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({ pdf: file.Location });
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map