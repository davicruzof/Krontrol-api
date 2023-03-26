"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const SecurityGroup_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SecurityGroup"));
const SecurityGroupUser_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SecurityGroupUser"));
exports.GrupoSchema = {
    nome: Validator_1.schema.string(),
    itens: Validator_1.schema.string(),
    id_empresa: Validator_1.schema.number()
};
class SecuritiesController {
    async createGroup({ request, response }) {
        await request.validate({ schema: Validator_1.schema.create(exports.GrupoSchema) });
        let dados = request.body();
        await SecurityGroup_1.default.create({ nome: dados.nome, itens: dados.itens, id_empresa: dados.id_empresa });
        response.json({ sucess: "Criado com sucesso" });
    }
    async getGroupById({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create({ id_grupo: Validator_1.schema.number() }) });
        let dados = request.body();
        return await SecurityGroup_1.default.query().select('*').where('id_grupo', dados.id_grupo).where('id_empresa', auth.user?.id_empresa);
    }
    async getAllGroups({ response, auth }) {
        return await SecurityGroup_1.default.query()
            .select('id_grupo')
            .select('nome')
            .select('itens')
            .where('id_empresa', auth.user?.id_empresa);
    }
    async updateGroup({ request, response }) {
        await request.validate({ schema: Validator_1.schema.create({ id_grupo: Validator_1.schema.number(), nome: Validator_1.schema.string.nullableAndOptional(), itens: Validator_1.schema.string() }) });
        let dados = request.body();
        let grupo = await SecurityGroup_1.default.findBy('id_grupo', dados.id_grupo);
        if (grupo) {
            grupo.merge(dados);
            await grupo.save();
            response.json({ sucess: "Atualizado com sucesso" });
        }
        else {
            response.json({ error: "Grupo não encontrado" });
        }
    }
    async createGroupUser({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create({
                id_grupo: Validator_1.schema.number(),
                id_usuario: Validator_1.schema.number(),
                id_empresa: Validator_1.schema.number()
            }) });
        let dados = request.body();
        await SecurityGroupUser_1.default.create({
            id_grupo: dados.id_grupo,
            id_usuario: dados.id_usuario,
            id_empresa: dados.id_empresa
        });
        response.json({ sucess: "Cadastrado com sucesso" });
    }
    async getGroupUserById({ request, response }) {
        await request.validate({ schema: Validator_1.schema.create({
                id_usuario_grupo: Validator_1.schema.number()
            }) });
        let dados = request.body();
        let query = await Database_1.default.rawQuery(`
            SELECT 
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            WHERE id_usuario_grupo = '${dados.id_usuario_grupo}'
            ORDER BY g.nome
        `);
        response.json(query.rows);
    }
    async getGroupUserByIdUser({ request, response, auth }) {
        let query = await Database_1.default.rawQuery(`
            SELECT 
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            WHERE ug.id_usuario = '${auth.user?.id_usuario}'
            ORDER BY g.nome
        `);
        response.json(query.rows);
    }
    async getAllGroupsUser({ response }) {
        let query = await Database_1.default.rawQuery(`
            SELECT 
            ug.id_usuario_grupo,
            g.nome as nome,
            ug.id_empresa,
            ug.id_usuario,
            g.itens
            FROM ml_usu_usuario_grupo ug
            INNER JOIN ml_perm_grupo g on (ug.id_grupo = g.id_grupo)
            ORDER BY g.nome
        `);
        response.json(query.rows);
    }
    async updateGroupUser({ request, response }) {
        await request.validate({ schema: Validator_1.schema.create({
                id_usuario_grupo: Validator_1.schema.number(),
                id_grupo: Validator_1.schema.number(),
                id_usuario: Validator_1.schema.number()
            }) });
        let dados = request.body();
        let groupUser = await SecurityGroupUser_1.default.findBy('id_usuario_grupo', dados.id_usuario_grupo);
        if (groupUser) {
            groupUser.merge(dados);
            groupUser.save();
            response.json({ sucess: "Atualizado com sucesso" });
        }
        else {
            response.json({ error: "Não encontrado" });
        }
    }
}
exports.default = SecuritiesController;
//# sourceMappingURL=SecuritiesController.js.map