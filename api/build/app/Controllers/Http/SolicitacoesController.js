"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Solicitacao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Solicitacao"));
const SolicitacaoFerias_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SolicitacaoFerias"));
const Solicitacao_2 = global[Symbol.for('ioc.use')]("App/Schemas/Solicitacao");
const Notifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notifications"));
const luxon_1 = require("luxon");
const MotivoSolicitacao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/MotivoSolicitacao"));
class SolicitacoesController {
    async create({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create(Solicitacao_2.solicitacaoSchema) });
        let dados = request.body();
        try {
            await Solicitacao_1.default.create({
                id_empresa_grupo: auth.user?.id_grupo,
                id_empresa: auth.user?.id_empresa,
                id_funcionario: auth.user?.id_funcionario,
                id_area: dados.id_area,
                id_modulo: dados.id_modulo,
                justificativa: dados.justificativa,
                dt_informada: dados?.dt_informada,
                id_motivo: dados.id_motivo,
            });
        }
        catch (error) {
            response.json(error);
        }
        response.json({ status: "Solicitação cadastrada " });
    }
    async getById({ request, response }) {
        let dados = request.body();
        if (dados.id_solicitacao) {
            let solicitacao = await Database_1.default.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            func.nome,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            INNER JOIN ml_fol_funcionario func ON (func.id_funcionario = sol.id_funcionario)
            WHERE id_solicitacao = ${dados.id_solicitacao}
        `);
            response.json(solicitacao.rows);
        }
    }
    async list({ request, response, auth }) {
        let dados = request.body();
        let condicoes = "";
        if (dados.status) {
            condicoes += ` AND sol.status = '${dados.status}' `;
        }
        if (dados.departamento) {
            condicoes += ` AND sol.id_area in (${dados.departamento.toString()}) `;
        }
        let solicitacoes = await Database_1.default.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            func.nome,
            func.registro,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            INNER JOIN ml_fol_funcionario func ON (func.id_funcionario = sol.id_funcionario)
            WHERE sol.id_empresa = ${auth.user?.id_empresa}
            ${condicoes}
            ORDER BY dt_cadastro
        `);
        response.json(solicitacoes.rows);
    }
    async listByUser({ request, response, auth }) {
        let dados = request.body();
        let condicoes = "";
        if (dados.status) {
            condicoes += ` AND sol.status = '${dados.status}' `;
        }
        let solicitacoes = await Database_1.default.connection("pg").rawQuery(`
            SELECT
            sol.id_solicitacao,
            sol.id_empresa,
            sol.id_funcionario,
            sol.id_area,
            sol.id_modulo,
            sol.id_evento,
            sol.status,
            sol.parecer,
            sol.justificativa,
            sol.dt_analise,
            sol.id_funcionario_analise,
            sol.dt_finalizada,
            sol.id_funcionario_finalizada,
            sol.dt_informada,
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
            sol.dt_cadastro as dt_cadastro_full,
            area.area,
            mod.modulo,
            NOW() - sol.dt_cadastro AS cadastrado_a,
            NOW() - sol.dt_atualizacao AS atualizado_a
            FROM ml_sac_solicitacao sol
            INNER JOIN ml_ctr_programa_area area ON (sol.id_area = area.id_area)
            INNER JOIN ml_ctr_programa_area_modulo mod ON (sol.id_modulo = mod.id_modulo)
            WHERE sol.id_empresa = '${auth.user?.id_empresa}'
            AND sol.id_funcionario = '${auth.user?.id_funcionario}'
            ${condicoes}
            ORDER BY dt_cadastro
        `);
        response.json(solicitacoes.rows);
    }
    async update({ request, response, auth }) {
        let dados = request.body();
        let solicitacao = await Solicitacao_1.default.findBy("id_solicitacao", dados.id_solicitacao);
        if (auth.user)
            if (solicitacao) {
                if (dados.status == "ANDAMENTO") {
                    solicitacao.id_funcionario_analise = auth.user.id_funcionario;
                }
                if (dados.status == "ATENDIDA") {
                    solicitacao.id_funcionario_finalizada = auth.user.id_funcionario;
                }
                solicitacao.merge(dados).save();
                let dadoNotify = await Database_1.default.connection("pg").rawQuery(`
            SELECT *
            FROM ml_ctr_programa_area_modulo
            WHERE id_modulo = ${solicitacao.id_modulo}
        `);
                await Notifications_1.default.create({
                    message: `A sua solicitação de ${dadoNotify.rows[0].modulo} foi atualizada`,
                    id_funcionario: solicitacao.id_funcionario,
                    type: 1,
                    created_at: luxon_1.DateTime.now().toString(),
                });
                response.json({ sucess: "Atualizado com sucesso" });
            }
            else {
                response.json({ error: "Erro ao atualizar" });
            }
    }
    async getParameter({ response, auth }) {
        try {
            if (auth.user) {
                const parameter = await SolicitacaoFerias_1.default.query().where("id_empresa", auth.user?.id_empresa);
                response.json(parameter);
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async getMotivos({ request, response, auth }) {
        let dados = request.body();
        if (!dados.modulo_id) {
            return response.json({ error: "Informe o módulo" });
        }
        try {
            if (auth.user) {
                const listMotivos = await MotivoSolicitacao_1.default.query()
                    .where("empresa_id", auth.user?.id_empresa)
                    .where("modulo_id", dados.modulo_id);
                if (listMotivos.length == 0) {
                    return response.json({ error: "Nenhum motivo encontrado" });
                }
                response.json(listMotivos);
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = SolicitacoesController;
//# sourceMappingURL=SolicitacoesController.js.map