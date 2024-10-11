"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class default_1 extends Seeder_1.default {
    async run() {
        let funcionario = await Funcionario_1.default.create({
            id_grupo: 1,
            cpf: "82867151791",
            id_empresa: 1,
            nome: "Administrador",
            id_sexo: 1,
            celular: "7981002233",
        });
        await User_1.default.create({
            id_empresa: 1,
            id_funcionario: funcionario.id_funcionario,
            senha: "L702874$23",
            id_grupo: funcionario.id_grupo
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=CreateFirstUser.js.map