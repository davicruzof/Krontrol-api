"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const userSchema = Validator_1.schema.create({
    cpf: Validator_1.schema.string(),
    id_empresa: Validator_1.schema.number(),
    senha: Validator_1.schema.string(),
    version: Validator_1.schema.string(),
    so: Validator_1.schema.string(),
});
class SignInController {
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
    }
    async upInsertVersion({ version, so, response, id_funcionario, id_empresa, }) {
        try {
            const versionExists = await AppVersion_1.default.query()
                .where("id_funcionario", id_funcionario)
                .where("id_empresa", id_empresa)
                .first();
            if (versionExists) {
                versionExists.merge({
                    app_version: version,
                    so: so,
                });
                await versionExists.save();
            }
            else {
                await AppVersion_1.default.create({
                    id_empresa: id_empresa,
                    so: so,
                    app_version: version,
                    id_funcionario: id_funcionario,
                });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async login({ request, response, auth }) {
        try {
            await request.validate({ schema: userSchema });
            const { cpf, id_empresa, senha, version, so } = request.body();
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
            const isValidPassword = await this.verifyPassword(user, senha);
            if (!isValidPassword) {
                return response.unauthorized({ error: "Dados inválidos" });
            }
            await this.upInsertVersion({
                version,
                so,
                response,
                id_funcionario: employee.id_funcionario,
                id_empresa,
            });
            response.json(await auth.use("api").generate(user, {
                expiresIn: "10 days",
            }));
        }
        catch (error) {
            response.badRequest(error.messages);
        }
    }
}
exports.default = SignInController;
//# sourceMappingURL=SignInController.js.map