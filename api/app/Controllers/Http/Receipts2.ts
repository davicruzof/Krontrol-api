import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class Receipts2 {
  public async dotCardPdfGenerator({ response }: HttpContextContract) {
    try {
      const query = await Database.connection("oracle").rawQuery(`
        select DISTINCT
          df.dtdigit as data_movimento,  
          from globus.frq_digitacaomovimento df 
          where 
            df.CODINTFUNC IN ('24257')
        AND df.dtdigit BETWEEN '27/12/2022' AND '26/01/2023'
        AND df.tipodigit = 'F'
        AND (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) > 0
        AND df.STATUSDIGIT = 'N'
    `);

      return response.json(query);
    } catch (error) {
      response.badRequest(error);
    }
  }
}
