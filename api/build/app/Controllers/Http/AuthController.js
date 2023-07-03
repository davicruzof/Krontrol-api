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
const GlobalController_1 = __importDefault(require("./GlobalController"));
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const userSchema = Validator_1.schema.create({
    cpf: Validator_1.schema.string(),
    id_empresa: Validator_1.schema.number(),
    senha: Validator_1.schema.string(),
});
class AuthController {
    constructor() {
        this.getEmployee = async (cpf, id_empresa) => {
            const funcionario = await Funcionario_1.default.query()
                .where("cpf", cpf)
                .where("id_empresa", id_empresa)
                .whereNot("id_situacao", 2)
                .first();
            return funcionario;
        };
        this.getUser = async (funcionario) => {
            const user = await User_1.default.query()
                .where("id_funcionario", funcionario.id_funcionario)
                .where("id_empresa", funcionario.id_empresa)
                .first();
            return user;
        };
        this.verifyPassword = async (user, senha) => {
            return await Hash_1.default.verify(user.senha, senha);
        };
        this.getEmployeeById = async (id_funcionario) => {
            const queryGetUser = `
      SELECT usu.id_usuario,usu.id_status,func.id_funcionario,
      func.id_grupo,func.id_empresa,func.nome,func.cpf,
      func.celular,func.email,func.cnh_validade,func.dt_nascimento
      FROM ml_fol_funcionario func
        INNER JOIN ml_usu_usuario usu ON (usu.id_funcionario = func.id_funcionario)
      WHERE func.id_funcionario = ${id_funcionario}`;
            let dadosFuncionario = await Database_1.default.connection("pg").rawQuery(queryGetUser);
            return dadosFuncionario.rows[0];
        };
    }
    async login({ request, response, auth }) {
        try {
            await request.validate({ schema: userSchema });
            const { cpf, id_empresa, senha, version } = request.body();
            const employee = await this.getEmployee(cpf, id_empresa);
            if (!employee) {
                return response.unauthorized({ error: "Funcionário inválido" });
            }
            if (employee.id_situacao === 2) {
                return response.unauthorized({ error: "Funcionário Inativo" });
            }
            const user = await this.getUser(employee);
            if (!user) {
                return response.unauthorized({ error: "Usuário inválido" });
            }
            if (version) {
                const versionStorage = await AppVersion_1.default.findBy("id_funcionario", user.id_funcionario);
                if (versionStorage) {
                    versionStorage.merge({ app_version: version }).save();
                }
                else {
                    await AppVersion_1.default.create({
                        id_funcionario: user.id_funcionario,
                        app_version: version,
                    });
                }
            }
            const isValidPassword = await this.verifyPassword(user, senha);
            if (!isValidPassword) {
                return response.unauthorized({ error: "Dados inválidos" });
            }
            response.json(await auth.use("api").generate(user));
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
        const global = new GlobalController_1.default();
        if (auth.user) {
            const [departments, user] = await Promise.all([
                global.getDepartments(auth.user.id_funcionario),
                this.getEmployeeById(auth.user.id_funcionario),
            ]);
            return response.json({
                user,
                departamentos: departments,
            });
        }
    }
    async change({ auth, request, response }) {
        try {
            const changePassword = Validator_1.schema.create({
                senha_atual: Validator_1.schema.string(),
                senha_nova: Validator_1.schema.string(),
            });
            await request.validate({ schema: changePassword });
            let dados = request.body();
            if (auth.user) {
                if (await Hash_1.default.verify(auth.user.senha, dados.senha_atual)) {
                    auth.user.senha = dados.senha_nova;
                    auth.user.save();
                    response.json({ sucess: "Senha Atualizada com sucesso" });
                }
                else {
                    response.badRequest({ error: "Dados inválidos" });
                }
            }
            else {
                response.badRequest({ error: "Usuário inválido" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async recovery({ request, response }) {
        try {
            const dados = await request.validate({ schema: userSchema });
            const funcionario = await Funcionario_1.default.query()
                .where({
                cpf: dados.cpf,
                id_empresa: dados.id_empresa,
            })
                .whereNot("ml_fol_funcionario.id_situacao", "=", 2)
                .select("id_funcionario", "cpf", "nome", "celular", "dt_nascimento")
                .first();
            if (!funcionario) {
                return response.json({ error: "Dados inválidos" });
            }
            const usuario = await User_1.default.findBy("id_funcionario", funcionario.id_funcionario);
            if (!usuario) {
                return response.json({ error: "Usuário não encontrado" });
            }
            usuario.senha = dados.senha;
            await usuario.save();
            response.json({ success: "Senha alterada com sucesso" });
        }
        catch (error) {
            response.json(error.messages);
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map