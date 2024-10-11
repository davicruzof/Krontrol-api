"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const Version_1 = global[Symbol.for('ioc.use')]("App/Schemas/Version");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class VersionApp {
    async create({ request, response, auth }) {
        try {
            const data = await request.validate({
                schema: Validator_1.schema.create(Version_1.AppVersionInsert),
            });
            if (!auth.user || !data) {
                return response.unauthorized({ error: "Funcionário inválido" });
            }
            const versionExists = await this.getVersionsByUser(auth);
            if (data.app_version && data.so) {
                if (versionExists) {
                    versionExists.merge({
                        app_version: data.app_version,
                        so: data.so,
                    });
                    await versionExists.save();
                    return response.json({ success: "Atualizado com sucesso" });
                }
                await AppVersion_1.default.create({
                    id_empresa: auth.user?.id_empresa,
                    so: data.so,
                    app_version: data.app_version,
                    id_funcionario: auth.user?.id_funcionario,
                });
                return response.json({ success: "Inserido com sucesso" });
            }
            else {
                response.json({ error: "Erro na inserção" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async getVersionsByUser(auth) {
        try {
            if (auth.user) {
                const version = await AppVersion_1.default.query()
                    .where("id_funcionario", auth.user?.id_funcionario)
                    .where("id_empresa", auth.user?.id_empresa)
                    .first();
                return version;
            }
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = VersionApp;
//# sourceMappingURL=VersionApp.js.map