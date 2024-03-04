"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Grupo_1 = require("./../../Schemas/Grupo");
const Grupo_2 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Grupo"));
class GruposController {
    async getAll({ response }) {
        let grupos = await Grupo_2.default.all();
        response.json(grupos);
    }
    async create({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Grupo_1.GrupoSchemaInsert) });
            const dados = request.all();
            await Grupo_2.default.create({
                id_empresa_grupo: dados.id_empresa_grupo,
                id_empresa: dados.id_empresa ? dados.id_empresa : auth.user?.id_empresa,
                grupo: dados.grupo,
                id_funcionario_cadastro: auth.user?.id_funcionario,
                id_status: dados.id_status,
            });
            response.json({ sucess: "Criado com sucesso! " });
        }
        catch (error) {
            response.json(error);
        }
    }
    async getByName({ request, response }) {
        let { nomeGrupo } = request.body();
        if (nomeGrupo) {
            let grupo = await Grupo_2.default.query()
                .select("*")
                .where("grupo", "LIKE", "%" + nomeGrupo + "%");
            if (grupo) {
                response.json(grupo);
            }
            else {
                response.json({ error: "Grupo não encontrado" });
            }
        }
        else {
            response.json({ error: "Grupo não encontrado" });
        }
    }
    async update({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Grupo_1.GrupoSchemaUpdate) });
            const dados = request.body();
            const grupo = await Grupo_2.default.findBy("id_grupo", dados.id_grupo);
            if (grupo) {
                grupo
                    .merge({
                    id_empresa_grupo: dados.id_empresa_grupo,
                    id_empresa: dados.id_empresa,
                    grupo: dados.grupo,
                    id_status: dados.id_status,
                    id_funcionario_alteracao: auth.user?.id_funcionario,
                })
                    .save();
                response.json({ sucess: "Atualizado com sucesso" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = GruposController;
//# sourceMappingURL=GruposController.js.map