"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const Funcao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcao"));
class EscalasController {
    async list({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create({ data: Validator_1.schema.date() }) });
        let dados = request.body();
        let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
        let query;
        let where;
        await funcionario?.preload("funcao");
        let funcao = await Funcao_1.default.findBy("id_funcao_erp", funcionario?.id_funcao_erp);
        query = ` SELECT pre.prefixoveic AS prefixo,lin.CODIGOLINHA AS linha,esc.cod_servdiaria AS tabela,to_char(esc.dat_escala, 'YYYY-MM-DD') as data_escala`;
        if (funcao?.funcao == "MOTORISTA") {
            query += `,locm.DESC_LOCALIDADE AS pegada, to_char(esc.hor_inicio_motorista, 'HH24:MI:SS') AS inicio, to_char(esc.hor_fim_motorista, 'HH24:MI:SS') AS fim`;
            where = " esc.cod_motorista ";
        }
        else {
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
        let result = await Database_1.default.connection("oracle").rawQuery(query);
        response.json(result);
    }
    async getList({ request, auth, response }) {
        let data = request.params().data;
        let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
        let query;
        let campos;
        let tipo;
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
                  WHERE to_char(esc.dat_escala, 'YYYY-MM-DD') = '${data}' and :tipo = '${funcionario?.id_funcionario_erp}'`;
        let result1 = await Database_1.default.connection("oracle").rawQuery(campos + query.replace(":tipo", tipo));
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
        let result2 = await Database_1.default.connection("oracle").rawQuery(campos + query.replace(":tipo", tipo));
        response.json(result1.concat(result2));
    }
}
exports.default = EscalasController;
//# sourceMappingURL=EscalasController.js.map