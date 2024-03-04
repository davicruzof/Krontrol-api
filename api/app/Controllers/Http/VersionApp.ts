import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AppVersion from "App/Models/AppVersion";
import { AppVersionInsert } from "App/Schemas/Version";
import { schema } from "@ioc:Adonis/Core/Validator";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

export default class VersionApp {
  public async create({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate({
        schema: schema.create(AppVersionInsert),
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

        await AppVersion.create({
          id_empresa: auth.user?.id_empresa,
          so: data.so,
          app_version: data.app_version,
          id_funcionario: auth.user?.id_funcionario,
        });

        return response.json({ success: "Inserido com sucesso" });
      } else {
        response.json({ error: "Erro na inserção" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  private async getVersionsByUser(auth: AuthContract) {
    try {
      if (auth.user) {
        const version = await AppVersion.query()
          .where("id_funcionario", auth.user?.id_funcionario)
          .where("id_empresa", auth.user?.id_empresa)
          .first();
        return version;
      }
    } catch (error) {
      return null;
    }
  }
}
