
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import Funcionario from 'App/Models/Funcionario';
import Env from '@ioc:Adonis/Core/Env';


export default class EscalasController {


    public async list({request,response, auth}:HttpContextContract){

        await request.validate({schema: schema.create({ data : schema.date() })});
      
        let dados = request.body();

        let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);
        let query:string;
        let where:string;
        await funcionario?.preload('funcao');

        query = ` SELECT PREFIXO,LINHA,TABELA,JORNADA_INICIO,JORNADA_FIM `;

        if(funcionario?.id_funcao_erp == 29){

          query += `,MOTORISTA_PEGADA,MOTORISTA_CHAPA,MOTORISTA_INICIO,MOTORISTA_FIM `;
          where = " ID_ERP_MOTORISTA ";

        }
        else{

          query += `,COBRADOR_PEGADA,COBRADOR_CHAPA,COBRADOR_INICIO,COBRADOR_FIM `;
          where = " ID_ERP_COBRADOR ";
          
        }
          query += ` FROM globus.vw_ml_ope_escalaservico WHERE DATA_SERVICO = To_Date('${dados.data}','YYYY-MM-DD') AND ${where} = ${funcionario?.id_funcionario_erp}`;

          let result = await Database.connection('oracle').rawQuery(query);

        response.json(result);

    }


}
