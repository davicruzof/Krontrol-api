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
                nome: dados.nome,
                funcao: dados.funcao,
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
                fun.id_empresa,
                fun.funcao,
                fun.nome,
                df.dtdigit AS data_movimento,
                oco.descocorr AS ocorrencia,
                NVL(CASE
                    WHEN df.CODOCORR IN (2, 12, 81) THEN
                        REPLACE(REPLACE(REPLACE(TO_CHAR(df.entradigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '10/11/2022 00:00:00', ''), '00:00', '')
                    ELSE
                        REPLACE(REPLACE(TO_CHAR(df.entradigit, 'HH24:MI'), '30/12/1899 00:00:00', ''), '10/11/2022 00:00:00', '')
                END, '--------') AS entrada,
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
                NVL(lin.codigolinha, '--------') AS linha,
                NVL(df.servicodigit, '--------') AS tabela,
                df.codocorr,
                NVL(CASE
                    WHEN df.CODOCORR IN (1, 5, 13, 31, 81, 85) THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(CASE WHEN df.CODOCORR IN (1, 5, 13, 31, 81, 85) THEN df.normaldm END, '999999990D99')), '.', ':')
                END, '--------') AS normal,
                NVL(CASE
                    WHEN df.outradm > 0 THEN
                        '' || REPLACE(LTRIM(TO_CHAR(df.outradm, '')), '#', ':')
                END, '--------') AS outra,
                NVL(CASE
                    WHEN df.adnotdm > 0 THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(df.adnotdm, '999999990D99')), '.', ':')
                END, '--------') AS a_not,
                NVL(CASE
                    WHEN df.CODOCORR IN (2) THEN
                        '0' || REPLACE(LTRIM(TO_CHAR(CASE WHEN df.CODOCORR IN (2) THEN df.normaldm END, '999999990D99')), '.', ':')
                END, '--------') AS dsr,
                TO_CHAR(df.extranotdm, '999999990D99') AS extranotdm,
                NVL(CASE
                    WHEN df.CODOCORR NOT IN (14, 28, 104) THEN
                        TO_CHAR((df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm), '999999990D99')
                END, '--------') AS TOTAL,
                NVL(TO_CHAR(bh.competencia, 'MM/YYYY'), '--------') AS bh_competencia,
                NVL(TO_CHAR(bh.credito, '999999900D99'), '--------') AS credito,
                NVL(TO_CHAR(bh.debito, '999999900D99'), '--------') AS debito,
                NVL(TO_CHAR(bh.saldoanterior, '999999900D99'), '--------') AS saldoanterior,
                NVL(TO_CHAR(bh.valorpago, '999999900D99'), '--------') AS valorpago,
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
                df.usudigit,
                df.DTDIGITDIGIT,
                fun.CODFUNC AS registro,
                NVL(bhd.BD_DEBITO, '--------') AS BD_DEBITO,
                NVL(bhd.BH_CREDITO, '--------') AS BH_CREDITO
            FROM globus.frq_digitacaomovimento df
            INNER JOIN VW_ML_FLP_FUNCIONARIO fun ON df.codintfunc = fun.id_funcionario_erp
            INNER JOIN globus.vw_bancohoras bh ON df.codintfunc = bh.codintfunc
            INNER JOIN globus.frq_ocorrencia oco ON df.codocorr = oco.codocorr
            LEFT JOIN globus.bgm_cadlinhas lin ON df.codintlinha = lin.codintlinha
            LEFT JOIN VW_ML_FRQ_BH_DIARIO bhd ON df.CODINTFUNC = bhd.CODINTFUNC AND bhd.DTDIGIT = df.DTDIGIT
            WHERE
                df.CODINTFUNC IN ('${funcionario.id_funcionario_erp}')
                AND df.dtdigit BETWEEN '${dateRequestInitial}' AND '${dateRequestFinish}'
                AND TO_CHAR(df.dtdigit, 'MM/YYYY') = TO_CHAR(bh.competencia, 'MM/YYYY')
                AND df.tipodigit = 'F'
                AND (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) > 0
                AND df.STATUSDIGIT = 'N';
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
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map