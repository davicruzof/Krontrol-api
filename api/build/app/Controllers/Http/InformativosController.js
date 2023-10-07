"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const luxon_1 = require("luxon");
const Informativo_1 = global[Symbol.for('ioc.use')]("App/Schemas/Informativo");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Informativo_2 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Informativo"));
class Receipts {
    constructor() {
        this.getInformativos = async ({ response, auth }) => {
            const { user } = auth;
            const data = luxon_1.DateTime.now().toFormat('yyyy-MM-dd');
            const informativos = await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_sac_informativo_funcionario 
            where funcionario_id = ${user?.id_funcionario}
            and vigencia_ini <= '${data}' 
            and vigencia_fim > '${data}' 
            and cancelado = false
            order by dt_cadastro desc 
            `);
            response.json({ informativos: informativos.rows });
        };
        this.updateInformativo = async ({ request, response, auth }) => {
            try {
                const data = await request.validate({
                    schema: Validator_1.schema.create(Informativo_1.InformativoSchema),
                });
                const { user } = auth;
                if (!user) {
                    return response.json({ error: 'Usuário não encontrado!' });
                }
                let informativo = await Informativo_2.default.query()
                    .from('ml_sac_informativo_visualizacao')
                    .select('*').where('informativo_id', data.informativo_id)
                    .where('funcionario_id', user.id_funcionario)
                    .where('id', data.id)
                    .where('informativo_id', data.informativo_id)
                    .where('empresa_id', user.id_empresa)
                    .first();
                if (!informativo) {
                    return response.json({ error: 'Informativo não encontrado!' });
                }
                const dataAtual = luxon_1.DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss.SSS ZZZ');
                informativo.merge({
                    status_id: 2,
                    dt_leitura: dataAtual,
                }).save();
                response.json(informativo);
            }
            catch (error) {
                response.json(error);
            }
        };
    }
}
exports.default = Receipts;
//# sourceMappingURL=InformativosController.js.map