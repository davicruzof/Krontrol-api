import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Funcionario from "App/Models/Funcionario";
import Funcao from "App/Models/Funcao";

export default class EscalasController {
  public async list({ request, response, auth }: HttpContextContract) {
    await request.validate({ schema: schema.create({ data: schema.date() }) });

    let dados = request.body();

    let funcionario = await Funcionario.findBy(
      "id_funcionario",
      auth.user?.id_funcionario
    );
    let query: string;
    let where: string;
    await funcionario?.preload("funcao");

    let funcao = await Funcao.findBy(
      "id_funcao_erp",
      funcionario?.id_funcao_erp
    );
    query = ` SELECT pre.prefixoveic AS prefixo,lin.CODIGOLINHA AS linha,esc.cod_servdiaria AS tabela,to_char(esc.dat_escala, 'YYYY-MM-DD') as data_escala`;

    if (funcao?.funcao == "MOTORISTA") {
      query += `,locm.DESC_LOCALIDADE AS pegada, to_char(esc.hor_inicio_motorista, 'HH24:MI:SS') AS inicio, to_char(esc.hor_fim_motorista, 'HH24:MI:SS') AS fim`;
      where = " esc.cod_motorista ";
    } else {
      query += `,locc.DESC_LOCALIDADE AS pegada, to_char(esc.hor_inicio_cobrador, 'HH24:MI:SS') AS inicio, to_char(esc.hor_fim_cobrador, 'HH24:MI:SS') AS fim `;
      where = " esc.cod_cobrador  ";
    }
    query += ` from globus.t_esc_servicodiaria esc inner join globus.t_esc_escaladiaria escd on esc.COD_INTESCALA = escd.COD_INTESCALA and esc.dat_escala = escd.dat_escala
                  left join globus.frt_cadveiculos pre on esc.cod_veic = pre.codigoveic
                  left join globus.bgm_cadlinhas lin on escd.COD_INTLINHA = lin.CODINTLINHA
                  left join globus.vw_funcionarios funm on esc.cod_motorista = funm.CODINTFUNC
                  left join globus.vw_funcionarios func on esc.cod_cobrador = func.CODINTFUNC
                  left  join globus.t_esc_localidade locm on esc.COD_PEG_MOT = locm.COD_LOCALIDADE
                  left  join globus.t_esc_localidade locc on esc.COD_PEG_COB = locc.COD_LOCALIDADE
                  WHERE to_char(esc.dat_escala, 'YYYY-MM-DD') = '${dados.data}' and ${where} = '${funcionario?.id_funcionario_erp}'`;

    let result = await Database.connection("oracle").rawQuery(query);

    response.json(result);
  }

  public async getList({ request, auth, response }: HttpContextContract) {
    let data = request.params().data;
    let funcionario = await Funcionario.findBy(
       "id_funcionario",
       auth.user?.id_funcionario
    );
    let query: string;
    let campos: string;
    let tipo: string;
    campos = `
      SELECT
        pre.prefixoveic AS prefixo,
        lin.CODIGOLINHA AS linha,
        esc.cod_servdiaria AS tabela,
        to_char(esc.dat_escala, 'YYYY-MM-DD') as data_escala,
        locm.DESC_LOCALIDADE AS pegada,
        to_char(esc.hor_inicio_motorista,
        'HH24:MI:SS') AS inicio,
        to_char(esc.hor_fim_motorista,
        'HH24:MI:SS') AS fim
    `;
    tipo = " esc.cod_motorista ";
    query = ` from globus.t_esc_servicodiaria esc inner join globus.t_esc_escaladiaria escd on esc.COD_INTESCALA = escd.COD_INTESCALA and esc.dat_escala = escd.dat_escala
                  left join globus.frt_cadveiculos pre on esc.cod_veic = pre.codigoveic
                  left join globus.bgm_cadlinhas lin on escd.COD_INTLINHA = lin.CODINTLINHA
                  left join globus.vw_funcionarios funm on esc.cod_motorista = funm.CODINTFUNC
                  left join globus.vw_funcionarios func on esc.cod_cobrador = func.CODINTFUNC
                  left  join globus.t_esc_localidade locm on esc.COD_PEG_MOT = locm.COD_LOCALIDADE
                  left  join globus.t_esc_localidade locc on esc.COD_PEG_COB = locc.COD_LOCALIDADE
                  WHERE to_char(esc.dat_escala, 'YYYY-MM-DD') = '${data}' and :tipo = '23218'`;

    let result1 = await Database.connection("oracle").rawQuery(
      campos + query.replace(":tipo", tipo)
    );

    campos = ` SELECT
      pre.prefixoveic AS prefixo,
      lin.CODIGOLINHA AS linha,
      esc.cod_servdiaria AS tabela,
      to_char(esc.dat_escala, 'YYYY-MM-DD') as data_escala,
      locc.DESC_LOCALIDADE AS pegada,
      to_char(esc.hor_inicio_cobrador, 'HH24:MI:SS') AS inicio,
      to_char(esc.hor_fim_cobrador, 'HH24:MI:SS') AS fim
    `;
    tipo = " esc.cod_cobrador  ";

    let result2 = await Database.connection("oracle").rawQuery(
      campos + query.replace(":tipo", tipo)
    );
    response.json(result1.concat(result2));
  }
}
