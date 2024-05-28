import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import Funcionario from "App/Models/Funcionario";
import AppVersion from "App/Models/AppVersion";

const userSchema = schema.create({
  cpf: schema.string(),
  id_empresa: schema.number(),
  senha: schema.string(),
  version: schema.string(),
  so: schema.string(),
});

export default class SignInController {
  private getEmployee = async (
    cpf: string,
    id_empresa: string
  ): Promise<Funcionario | null> => {
    const funcionario = await Funcionario.query()
      .where("cpf", cpf)
      .where("id_empresa", id_empresa)
      .whereNot("id_situacao", 2)
      .first();

    return funcionario;
  };

  private getUser = async (funcionario: Funcionario): Promise<User | null> => {
    const user = await User.query()
      .where("id_funcionario", funcionario.id_funcionario)
      .where("id_empresa", funcionario.id_empresa)
      .first();

    return user;
  };

  private verifyPassword = async (
    user: User,
    senha: string
  ): Promise<Boolean> => {
    return await Hash.verify(user.senha, senha);
  };

  private async upInsertVersion({
    version,
    so,
    response,
    id_funcionario,
    id_empresa,
  }: {
    version: string;
    so: string;
    response: any;
    id_funcionario: number;
    id_empresa: number;
  }) {
    try {
      const versionExists = await AppVersion.query()
        .where("id_funcionario", id_funcionario)
        .where("id_empresa", id_empresa)
        .first();

      if (versionExists) {
        versionExists.merge({
          app_version: version,
          so: so,
        });
        await versionExists.save();
      } else {
        await AppVersion.create({
          id_empresa: id_empresa,
          so: so,
          app_version: version,
          id_funcionario: id_funcionario,
        });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
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

      response.json(
        await auth.use("api").generate(user, {
          expiresIn: "10 days",
        })
      );
    } catch (error) {
      response.badRequest(error.messages);
    }
  }
}
