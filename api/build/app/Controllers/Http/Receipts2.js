"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const ConfirmarPdf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ConfirmarPdf"));
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
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
                TO_CHAR(df.extranotdm, '999999990D99') AS extranotdm,
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
            FROM frq_digitacaomovimento df
            INNER JOIN VW_ML_FLP_FUNCIONARIO fun ON df.codintfunc = fun.id_funcionario_erp
            INNER JOIN vw_bancohoras bh ON df.codintfunc = bh.codintfunc
            INNER JOIN frq_ocorrencia oco ON df.codocorr = oco.codocorr
            LEFT JOIN bgm_cadlinhas lin ON df.codintlinha = lin.codintlinha
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
            const confirmacao = await ConfirmarPdf_1.default.query()
                .select("*")
                .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                .andWhere("data_pdf", "=", `${dados.data}`);
            if (!confirmacao) {
                return response.badRequest({ error: "Erro ao aplicar confirmação!" });
            }
            return response.json({ query });
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map