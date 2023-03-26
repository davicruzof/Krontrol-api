"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solicitacaoSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Solicitacao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Solicitacao"));
exports.solicitacaoSchema = {
    id_area: Validator_1.schema.number(),
    id_modulo: Validator_1.schema.number(),
    justificativa: Validator_1.schema.string(),
};
class SolicitacoesController {
    async create({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create(exports.solicitacaoSchema) });
        let dados = request.body();
        try {
            await Solicitacao_1.default.create({
                id_empresa_grupo: auth.user?.id_grupo,
                id_empresa: auth.user?.id_empresa,
                id_funcionario: auth.user?.id_funcionario,
                id_area: dados.id_area,
                id_modulo: dados.id_modulo,
                justificativa: dados.justificativa,
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
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
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
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
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
            TO_CHAR(sol.dt_cadastro, 'DD-MM-YYYY') as dt_cadastro,
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
                response.json({ sucess: "Atualizado com sucesso" });
            }
            else {
                response.json({ error: "Erro ao atualizar" });
            }
    }
}
exports.default = SolicitacoesController;
//# sourceMappingURL=SolicitacoesController.js.map