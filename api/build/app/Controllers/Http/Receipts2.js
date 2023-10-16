"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class Receipts2 {
    async dotCardPdfGenerator({ response }) {
        try {
            const query = await Database_1.default.connection("oracle")
                .rawQuery(`select DISTINCT
  df.dtdigit as data_movimento,  
  CASE WHEN df.CODOCORR  IN(2,12,81) THEN REPLACE(replace(replace(to_char(df.entradigit,'HH24:MI'),'30/12/1899 00:00:00',''),'10/11/2022 00:00:00',''),'00:00','') ELSE replace(replace(to_char(df.entradigit,'HH24:MI'),'30/12/1899 00:00:00',''),'10/11/2022 00:00:00','') END  entrada,
  CASE WHEN df.CODOCORR  IN(2,12,81) THEN REPLACE(replace(to_char(df.intidigit,'HH24:MI'),'30/12/1899 00:00:00',''),'00:00','')  ELSE replace(to_char(df.intidigit,'HH24:MI'),'30/12/1899 00:00:00','') END as I_INI, 
  CASE WHEN df.CODOCORR  IN(2,12,81) THEN REPLACE(replace(to_char(df.intfdigit,'HH24:MI'),'30/12/1899 00:00:00',''),'00:00','')  ELSE replace(to_char(df.intfdigit,'HH24:MI'),'30/12/1899 00:00:00','') END AS I_FIM,
  CASE WHEN df.CODOCORR  IN(2,12,81) THEN replace(replace(to_char(df.saidadigit,'HH24:MI'),'30/12/1899 00:00:00',''),'00:00','') ELSE replace(to_char(df.saidadigit,'HH24:MI'),'30/12/1899 00:00:00','') END AS SAIDA,
  df.servicodigit as tabela,
  CASE WHEN df.CODOCORR  IN(1,5,13,31,81,85)  THEN '0'|| REPLACE (  ltrim( to_char( (CASE WHEN df.CODOCORR  IN(1,5,13,31,81,85) THEN df.normaldm END),'999999990D99')),'.',':') END AS  normal, 
  CASE WHEN df.outradm > 0 THEN ''|| REPLACE (  ltrim( to_char(df.outradm,'')),'#',':') END AS outra,
  CASE WHEN df.adnotdm > 0 THEN '0'|| REPLACE (  ltrim( to_char(df.adnotdm,'999999990D99')),'.',':') END AS a_not,
  CASE WHEN df.CODOCORR  IN(2)  THEN '0'|| REPLACE (  ltrim( to_char( (CASE WHEN df.CODOCORR  IN(2) THEN df.normaldm END),'999999990D99')),'.',':') END AS  dsr  , 
  to_char(df.extranotdm ,'999999990D99')  extranotdm, 
  CASE WHEN df.CODOCORR NOT IN (14,28,104) THEN  to_char( (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) ,'999999990D99') END AS TOTAL
  from globus.frq_digitacaomovimento df 
  where 
    df.CODINTFUNC IN ('24257')
AND df.dtdigit BETWEEN '27/12/2022' AND '26/01/2023'
AND df.tipodigit = 'F'
AND (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) > 0
AND df.STATUSDIGIT = 'N'`);
            return response.json(query);
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map