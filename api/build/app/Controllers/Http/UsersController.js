"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const User_2 = require("../../Schemas/User");
const functions_1 = require("../../../libs/functions");
class UsersController {
    async create({ request, response }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(User_2.UserSchemaInsert) });
            const dados = request.body();
            if (!(0, functions_1.date_is_valid)(dados.dt_nascimento)) {
                response.badRequest({ error: "Data Inválida" });
                return;
            }
            const funcionario = await Funcionario_1.default.query()
                .where("cpf", dados.cpf)
                .where("id_empresa", dados.id_empresa)
                .where("id_situacao", 1)
                .first();
            if (funcionario) {
                const usuario = await User_1.default.findBy("id_funcionario", funcionario.id_funcionario);
                if (usuario) {
                    response.json({ sucess: "Usuário já cadastrado" });
                }
                else {
                    await User_1.default.create({
                        id_empresa: dados.id_empresa,
                        id_funcionario: funcionario.id_funcionario,
                        senha: dados.senha,
                        id_grupo: funcionario.id_grupo,
                    });
                    response.json({ sucess: "Usuário cadastrado" });
                }
            }
            else {
                response.badRequest({ error: "Funcionário não cadastrado" });
            }
        }
        catch (error) {
            response.badRequest(error);
        }
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map