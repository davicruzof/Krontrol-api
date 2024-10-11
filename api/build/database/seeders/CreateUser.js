"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class default_1 extends Seeder_1.default {
    async run() {
        await User_1.default.create({
            id_empresa: 1,
            id_funcionario: 9142,
            senha: "L702874$23",
            id_grupo: 1
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=CreateUser.js.map