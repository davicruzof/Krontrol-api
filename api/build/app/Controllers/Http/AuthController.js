"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const loginSchema = Validator_1.schema.create({
    cpf: Validator_1.schema.string(),
    id_empresa: Validator_1.schema.number(),
    senha: Validator_1.schema.string()
});
const changePassword = Validator_1.schema.create({
    senha_atual: Validator_1.schema.string(),
    senha_nova: Validator_1.schema.string()
});
class AuthController {
    async login({ request, response, auth }) {
        try {
            await request.validate({ schema: loginSchema });
            const { cpf, id_empresa, senha } = request.body();
            const funcionario = await Funcionario_1.default
                .query()
                .where('cpf', cpf)
                .where('id_empresa', id_empresa)
                .where('id_situacao', 1)
                .first();
            if (funcionario) {
                const usuario = await User_1.default
                    .query()
                    .where('id_funcionario', funcionario.id_funcionario)
                    .where('id_empresa', funcionario.id_empresa)
                    .first();
                if (usuario) {
                    if (!(await Hash_1.default.verify(usuario.senha, senha))) {
                        return response.unauthorized({ error: "Dados inválidos" });
                    }
                    else {
                        const token = await auth.use('api').generate(usuario);
                        return token;
                    }
                }
            }
            else {
                response.json({ error: "Dados inválidos" });
            }
        }
        catch (error) {
            response.badRequest(error.messages);
        }
    }
    async logout({ auth }) {
        if (auth) {
            await auth.logout();
        }
    }
    async me({ auth, response }) {
        let dadosFuncionario = await Database_1.default
            .connection('pg')
            .rawQuery(`
                        SELECT
                        usu.id_usuario,
                        usu.id_status,
                        func.id_funcionario,
                        func.id_grupo,
                        func.id_empresa,
                        func.nome,
                        func.cpf,
                        func.celular,
                        func.email,
                        func.cnh_validade,
                        func.dt_nascimento
                        FROM ml_fol_funcionario func
                            INNER JOIN ml_usu_usuario usu ON (usu.id_funcionario = func.id_funcionario)
                        WHERE func.id_funcionario = ${auth.user?.id_funcionario}`);
        let departamentos = await Database_1.default.connection('pg').rawQuery(`
            SELECT fa.id_area,ar.area 
            FROM ml_ctr_funcionario_area fa INNER JOIN ml_ctr_programa_area ar ON (fa.id_area = ar.id_area)
            WHERE fa.id_funcionario = ${auth.user?.id_funcionario}
        `);
        let user = dadosFuncionario.rows[0];
        return response.json({
            user,
            departamentos: departamentos.rows
        });
    }
    async change({ auth, request, response }) {
        try {
            await request.validate({ schema: changePassword });
            let dados = request.body();
            if (await Hash_1.default.verify(auth.user?.senha, dados.senha_atual)) {
                auth.user.senha = dados.senha_nova;
                auth.user.save();
                response.json({ sucess: 'Senha Atualizada com sucesso' });
            }
            else {
                response.badRequest({ error: 'Dados inválidos' });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async recovery({ auth, request, response }) {
        try {
            await request.validate({ schema: Validator_1.schema.create({
                    cpf: Validator_1.schema.string(),
                    id_empresa: Validator_1.schema.number(),
                    senha: Validator_1.schema.string()
                }) });
            let dados = request.body();
            let funcionario = await Funcionario_1.default
                .query()
                .select('id_funcionario')
                .select('cpf')
                .select('nome')
                .select('celular')
                .select('dt_nascimento')
                .where('cpf', '=', dados.cpf)
                .where('id_empresa', '=', dados.id_empresa)
                .where('ml_fol_funcionario.id_situacao', '=', 1)
                .first();
            if (funcionario) {
                let usuario = await User_1.default.findBy('id_funcionario', funcionario.id_funcionario);
                if (usuario) {
                    usuario.senha = dados.senha;
                    usuario.save();
                    response.json({ sucess: 'Senha alterada com sucesso' });
                }
                else {
                    response.json({ error: 'Usuário não encontrado' });
                }
            }
            else {
                response.json({ error: 'Dados inválidos' });
            }
        }
        catch (error) {
            response.json(error.messages);
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map