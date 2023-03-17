import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import Funcionario from "App/Models/Funcionario";
import Database from "@ioc:Adonis/Lucid/Database";
import GlobalController from "./GlobalController";

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
      .where("id_situacao", 1)
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

      const { cpf, id_empresa, senha } = request.body();

      const employee = await this.getEmployee(cpf, id_empresa);

      if (employee) {
        const user = await this.getUser(employee);
        if (user) {
          const isValidPassword = await this.verifyPassword(user, senha);

          if (isValidPassword) {
            await auth.use("api").generate(user);
          } else {
            return response.unauthorized({ error: "Dados inválidos" });
          }
        } else {
          return response.unauthorized({ error: "Usuário inválido" });
        }
      } else {
        return response.unauthorized({ error: "Funcionário inválido" });
      }
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
      func.celular,func.email,func.cnh_validade,func.dt_nascimento
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
      const departments = global.getDepartments(auth.user.id_funcionario);

      return response.json({
        user: this.getEmployeeById(auth.user.id_funcionario),
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
      await request.validate({ schema: userSchema });

      let dados = request.body();

      let funcionario = await Funcionario.query()
        .select("id_funcionario")
        .select("cpf")
        .select("nome")
        .select("celular")
        .select("dt_nascimento")
        .where("cpf", "=", dados.cpf)
        .where("id_empresa", "=", dados.id_empresa)
        .where("ml_fol_funcionario.id_situacao", "=", 1)
        .first();

      if (funcionario) {
        let usuario = await User.findBy(
          "id_funcionario",
          funcionario.id_funcionario
        );

        if (usuario) {
          usuario.senha = dados.senha;
          usuario.save();
          response.json({ sucess: "Senha alterada com sucesso" });
        } else {
          response.json({ error: "Usuário não encontrado" });
        }
      } else {
        response.json({ error: "Dados inválidos" });
      }
    } catch (error) {
      response.json(error.messages);
    }
  }
}
