
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import Funcionario from 'App/Models/Funcionario';
import Env from '@ioc:Adonis/Core/Env';
import Funcao from 'App/Models/Funcao';


export default class EscalasController {


    public async list({request,response, auth}:HttpContextContract){

        await request.validate({schema: schema.create({ data : schema.date() })});
      
        let dados = request.body();

        let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);
        let query:string;
        let where:string;
        await funcionario?.preload('funcao');

        let funcao = await Funcao.findBy('id_funcao_erp',funcionario?.id_funcao_erp);
        query = ` SELECT PREFIXO AS prefixo,LINHA AS linha,TABELA AS tabela `;

        if(funcao?.funcao == 'MOTORISTA'){

          query += `,MOTORISTA_PEGADA AS pegada, to_char(MOTORISTA_INICIO, 'HH24:MI:SS') AS inicio, to_char(MOTORISTA_FIM, 'HH24:MI:SS') AS fim`;
          where = " ID_ERP_MOTORISTA ";

        }
        else{

          query += `,COBRADOR_PEGADA AS pegada, to_char(COBRADOR_INICIO, 'HH24:MI:SS') AS inicio, to_char(COBRADOR_FIM, 'HH24:MI:SS') AS fim `;
          where = " ID_ERP_COBRADOR ";
          
        }
          query += ` FROM globus.vw_ml_ope_escalaservico WHERE to_char(DATA_SERVICO,'YYYY-MM-DD')  = '${dados.data}' AND ${where} = ${funcionario?.id_funcionario_erp}`;

          let result = await Database.connection('oracle').rawQuery(query);

        response.json(result);

    }


}
