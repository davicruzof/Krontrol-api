"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class Receipts2 {
    async dotCardPdfGenerator({ response }) {
        try {
            const query = await Database_1.default.connection("oracle").rawQuery(`
        select DISTINCT
          df.dtdigit as data_movimento
          from globus.frq_digitacaomovimento df 
          where 
            df.CODINTFUNC = '24257'
            AND df.dtdigit BETWEEN '27/12/2022' AND '26/01/2023'
            AND df.tipodigit = 'F'
            AND (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) > 0
            AND df.STATUSDIGIT = 'N'
    `);
            return response.json(query);
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = Receipts2;
//# sourceMappingURL=Receipts2.js.map