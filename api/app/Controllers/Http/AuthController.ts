import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import Funcionario from "App/Models/Funcionario";
import Database from "@ioc:Adonis/Lucid/Database";
import GlobalController from "./GlobalController";
import AppVersion from "App/Models/AppVersion";

const userSchema = schema.create({
  cpf: schema.string(),
  id_empresa: schema.number(),
  senha: schema.string(),
});

export default class AuthController {
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

  public async login({ request, response, auth }: HttpContextContract) {
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
        const versionStorage = await AppVersion.findBy(
          "id_funcionario",
          user.id_funcionario
        );

        if (versionStorage) {
          versionStorage.merge({ app_version: version }).save();
        } else {
          await AppVersion.create({
            id_funcionario: user.id_funcionario,
            app_version: version,
          });
        }
      }

      const isValidPassword = await this.verifyPassword(user, senha);

      if (!isValidPassword) {
        return response.unauthorized({ error: "Dados inválidos" });
      }

      response.json(
        await auth.use("api").generate(user, {
          expiresIn: "10 days",
        })
      );
    } catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async logout({ auth }: HttpContextContract) {
    if (auth) {
      await auth.logout();
    }
  }

  private getEmployeeById = async (id_funcionario: number) => {
    const queryGetUser = `
      SELECT usu.id_usuario,usu.id_status,func.id_funcionario,
      func.id_grupo,func.id_empresa,func.nome,func.cpf,
      func.id_funcionario_erp,
      func.celular,func.email,func.dt_nascimento
      FROM ml_fol_funcionario func
        INNER JOIN ml_usu_usuario usu ON (usu.id_funcionario = func.id_funcionario)
      WHERE func.id_funcionario = ${id_funcionario}`;

    let dadosFuncionario = await Database.connection("pg").rawQuery(
      queryGetUser
    );

    return dadosFuncionario.rows[0];
  };

  public async me({ auth, response }: HttpContextContract) {
    const global = new GlobalController();

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

  public async change({ auth, request, response }: HttpContextContract) {
    try {
      const changePassword = schema.create({
        senha_atual: schema.string(),
        senha_nova: schema.string(),
      });

      await request.validate({ schema: changePassword });
      let dados = request.body();

      if (auth.user) {
        if (await Hash.verify(auth.user.senha, dados.senha_atual)) {
          auth.user.senha = dados.senha_nova;
          auth.user.save();

          response.json({ sucess: "Senha Atualizada com sucesso" });
        } else {
          response.badRequest({ error: "Dados inválidos" });
        }
      } else {
        response.badRequest({ error: "Usuário inválido" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async recovery({ request, response }: HttpContextContract) {
    try {
      const dados = await request.validate({ schema: userSchema });

      const funcionario = await Funcionario.query()
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

      const usuario = await User.findBy(
        "id_funcionario",
        funcionario.id_funcionario
      );

      if (!usuario) {
        return response.json({ error: "Usuário não encontrado" });
      }

      usuario.senha = dados.senha;
      await usuario.save();

      response.json({ success: "Senha alterada com sucesso" });
    } catch (error) {
      response.json(error.messages);
    }
  }
}
