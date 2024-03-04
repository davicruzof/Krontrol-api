import Empresa from "App/Models/Empresa";
import ConfirmarPdf from "App/Models/ConfirmarPdf";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Funcionario from "../../Models/Funcionario";
import { upload } from "App/Controllers/Http/S3";
import FuncionarioArea from "App/Models/FuncionarioArea";
import {
  FuncionarioSchemaInsert,
  updateProfileFuncionario,
} from "App/Schemas/Funcionario";
import Database, {
  ChainableContract,
  RawQuery,
  ReferenceBuilderContract,
} from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import ConfirmaFichaPonto from "App/Models/ConfirmaFichaPonto";
import crypto from "crypto";
import GlobalController from "./GlobalController";
import { format } from "date-fns";

export default class FuncionariosController {
  public async create({ request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create(FuncionarioSchemaInsert),
      });
      const fotoPerfil = request.file("foto_perfil");
      const dados = request.body();
      let s3Object;
      let empresa = await Empresa.findBy("id_empresa", dados.id_empresa);
      if (!empresa) {
        return response.badRequest({ error: "Empresa não encontrada" });
      }
      let funcionario = await Funcionario.findBy("cpf", dados.cpf);

      if (funcionario) {
        response.badRequest({ error: "Este cpf já possui cadastro" });
      } else {
        if (fotoPerfil) {
          let hashImg = crypto.randomBytes(10).toString("hex");
          let filename = `${hashImg}-${fotoPerfil.clientName}`;

          s3Object = await upload({
            folder: "logo",
            filename: filename,
            bucket: empresa.bucket,
            path: filename,
            file: fotoPerfil,
            type: fotoPerfil.extname,
          });
        }
        await Funcionario.create({
          id_grupo: dados.id_grupo,
          cpf: dados.cpf,
          id_empresa: dados.id_empresa,
          registro: dados.registro,
          nome: dados.nome,
          id_sexo: dados.id_sexo,
          celular: dados.celular,
          id_funcao_erp: dados.id_funcao,
          dt_nascimento: dados.dt_nascimento,
          email: dados.email,
          cnh_emissao: dados.cnh_emissao,
          id_cnh: dados.id_cnh,
          foto_url: s3Object.Location,
        });
        response.json({ sucess: "Criado com sucesso" });
      }
    } catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    const { id_funcionario } = request.body();

    if (id_funcionario) {
      const funcionario = await Database.connection("pg")
        .query()
        .from("ml_fol_funcionario")
        .select("*")
        .leftJoin(
          "ml_fol_funcionario_situacao",
          "ml_fol_funcionario_situacao.id_situacao",
          "=",
          "ml_fol_funcionario.id_situacao"
        )
        .leftJoin(
          "ml_fol_funcionario_funcao",
          "ml_fol_funcionario_funcao.id_funcao_erp",
          "=",
          "ml_fol_funcionario.id_funcao_erp"
        )
        .where("ml_fol_funcionario.id_funcionario", id_funcionario);

      if (funcionario[0]) {
        let funcionario_erp = await Database.connection("oracle").rawQuery(`
                            SELECT CODFUNC FROM globus.vw_ml_flp_funcionario
                            WHERE id_funcionario_erp = '${funcionario[0].id_funcionario_erp}'
                        `);

        const global = new GlobalController();

        const departments = global.getDepartments(id_funcionario);

        funcionario[0].codfunc = funcionario_erp[0].CODFUNC;
        funcionario[0].departamentos = departments;
        response.json(funcionario);
      } else {
        response.json({ error: "Funcionário não encontrada" });
      }
    } else {
      response.json({ error: "Funcionário não encontrada" });
    }
  }

  public async getAll({ response, auth }: HttpContextContract) {
    if (auth.user) {
      let funcionarios = await Database.from("ml_fol_funcionario")
        .select("id_funcionario")
        .select("cpf")
        .select("nome")
        .select("registro")
        .select("ml_fol_funcionario_funcao.funcao")
        .where("ml_fol_funcionario.id_empresa", "=", auth.user.id_empresa)
        .where("ml_fol_funcionario.id_situacao", "=", 1)
        .leftJoin(
          "ml_fol_funcionario_funcao",
          "ml_fol_funcionario_funcao.id_funcao_erp",
          "=",
          "ml_fol_funcionario.id_funcao_erp"
        );

      response.json(funcionarios);
    } else {
      response.json({ error: "Usuário inválido" });
    }
  }

  public async addArea({ request, response }: HttpContextContract) {
    const arrayArea = request.body().area;
    const id_funcionario = request.body().id_funcionario;
    const funcionario_dados = await Funcionario.findBy(
      "id_funcionario",
      id_funcionario
    );
    if (id_funcionario && arrayArea) {
      let deleta = await FuncionarioArea.query()
        .where("id_funcionario", "=", id_funcionario)
        .delete();
      if (deleta) {
        arrayArea.forEach(async (element) => {
          await FuncionarioArea.create({
            id_funcionario: id_funcionario,
            id_empresa: funcionario_dados?.id_empresa,
            id_area: element,
          });
        });
        response.json({ sucess: "Cadastro Realizado" });
      }
    } else if (id_funcionario) {
      await FuncionarioArea.query()
        .where("id_funcionario", "=", id_funcionario)
        .delete();
      response.json({ sucess: "Alteração realizada" });
    }
  }

  public async removeArea({ request, response }: HttpContextContract) {
    const arrayArea = request.body().area;
    const id_funcionario = request.body().id_funcionario;

    await Promise.all(
      arrayArea.forEach(
        async (
          element:
            | string
            | number
            | boolean
            | Date
            | Buffer
            | ChainableContract
            | RawQuery
            | string[]
            | number[]
            | Date[]
            | boolean[]
            | ReferenceBuilderContract
        ) => {
          let areaFunc = await FuncionarioArea.query()
            .select("*")
            .where("id_funcionario", "=", id_funcionario)
            .andWhere("id_area", "=", element)
            .limit(1);
          if (areaFunc[0]) {
            await areaFunc[0].delete();
          }
        }
      )
    );
    response.json({ sucess: "Area(s) removidas com sucesso" });
  }

  public async updateProfile({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create(updateProfileFuncionario),
      });

      let dados = request.body();

      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );

      if (funcionario) {
        funcionario.merge(dados);
        funcionario.save();

        response.json({ sucess: "Atualizado com sucesso" });
      }
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async checkByCpf({ request, response }) {
    await request.validate({
      schema: schema.create({
        cpf: schema.string(),
        id_empresa: schema.number(),
      }),
    });

    let dados = request.body();

    let funcionario = await Funcionario.query()
      .select("id_funcionario")
      .select("cpf")
      .select("nome")
      .select("celular")
      .select("dt_nascimento")
      .where("cpf", "=", dados.cpf)
      .where("id_empresa", "=", dados.id_empresa)
      .first();

    if (funcionario) {
      response.json({
        id_funcionario: funcionario.id_funcionario,
        cpf: funcionario.cpf,
        nome: funcionario.nome,
        celular: funcionario.celular,
        dt_nascimento: funcionario.dt_nascimento,
        situacao: "OK",
      });
    } else {
      response.json({ return: "CPF não encontrado" });
    }
  }

  public async dotCard({ request, auth, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create({ data: schema.date({ format: "yyyy-mm" }) }),
      });
      let dados = request.body();
      let data = dados.data.split("-");
      const firstDay = new Date(data[0], data[1] - 1, 1);
      const lastDay = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth() + 1,
        0
      );

      if (dados.data) {
        let funcionario = await Funcionario.findBy(
          "id_funcionario",
          auth.user?.id_funcionario
        );
        let query = await Database.connection("oracle").rawQuery(`
                                  select distinct
                                    func.id_funcionario_erp,
                                    func.chapafunc CHAPA,
                                    func.codfunc CODFUNC,
                                    lin.codigolinhamin LINHA,
                                    car.prefixoveic prefixo,
                                    oco.descocorr,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY'),'30/12/1899','FOLGA') DATA_OPERACAO,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_INICIO,
                                    replace(to_char(pon.intidigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_INICIO,
                                    replace(to_char(pon.intfdigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_FIM,
                                    replace(to_char(pon.saidadigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_FIM,
                                    to_char(pon.competdigit,'DD/MM/YYYY') COMPETENCIA,
                                    pon.usudigit DIGITADO_POR,
                                    to_char(pon.dtdigit,'DD/MM/YYYY') DATA_DIGITACAO
                                from
                                    globus.frq_digitacaomovimento pon
                                    inner join globus.vw_ml_flp_funcionario func on pon.codintfunc = func.id_funcionario_erp
                                    inner join globus.frq_ocorrencia oco on pon.codocorr = oco.codocorr
                                    left join globus.frt_cadveiculos car on pon.codigoveic = car.codigoveic
                                    left join globus.bgm_cadlinhas lin on pon.codintlinha = lin.codintlinha
                                    WHERE
                                        pon.tipodigit = 'F' AND
                                        pon.dtdigit BETWEEN to_date('${firstDay.toLocaleDateString()}','DD/MM/YYYY') and to_date('${format(
          lastDay,
          "dd/MM/yyyy"
        )}','DD/MM/YYYY')
                                        and func.id_funcionario_erp= '${
                                          funcionario?.id_funcionario_erp
                                        }'
                                    order by DATA_DIGITACAO ASC
                                    `);

        await Promise.all(
          query.map(async (element) => {
            element["CONFIRMADO"] = "";
            const confirma = await this.getConfirmaFichaPonto(
              element.DATA_OPERACAO,
              auth.user?.id_funcionario
            ).then(function (data) {
              return data;
            });
            element.CONFIRMADO = confirma;
          })
        );

        response.json(query);
      } else {
        response.json({ error: "data is required" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  private async getFuncionario(id: number, campos = "*") {
    let query = await Database.connection("pg").rawQuery(`
                        SELECT ${campos}
                        FROM ml_fol_funcionario
                        WHERE id_funcionario = ${id}
                        LIMIT 1
                    `);
    return query.rows[0];
  }

  private async getConfirmaFichaPonto(data, id_funcionario) {
    let query = await Database.connection("pg").rawQuery(`
                        SELECT id
                        FROM ml_usu_confirma_ficha_ponto
                        WHERE id_funcionario = ${id_funcionario} and to_char(dt_referencia, 'YYYY-MM-DD HH24:MI:SS') = '${data}'
                    `);

    if (query.rows.length > 0) {
      return true;
    } else return false;
  }

  public async confirmDotCard({
    request,
    auth,
    response,
  }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create({
          data: schema.date({
            format: "yyyy-MM-dd HH:mm:ss",
          }),
        }),
      });
      let data = request.body().data;

      if (
        !(await this.getConfirmaFichaPonto(data, auth.user?.id_funcionario))
      ) {
        if (auth.user) {
          let funcionario = await this.getFuncionario(
            auth.user?.id_funcionario,
            "id_funcionario_erp"
          );

          await ConfirmaFichaPonto.create({
            id_funcionario: auth.user?.id_funcionario,
            id_funcionario_erp: funcionario.id_funcionario_erp,
            dt_referencia: data,
          });

          response.json({ sucess: "Confirmado com sucesso " });
        }
      } else {
        response.json({ error: " Data já confirmada" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async inactivate({ auth, response }: HttpContextContract) {
    try {
      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );
      if (funcionario) {
        funcionario.id_situacao = 5;
        await funcionario.save();
        response.json({ sucess: true });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async deleteAccount({ request, response }) {
    try {
      await request.validate({
        schema: schema.create({ id_funcionario: schema.number() }),
      });
      let dados = request.body();
      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        dados.id_funcionario
      );
      if (funcionario) {
        if (funcionario.id_situacao == 5) {
          await funcionario.delete();
          let user = await User.findBy("id_funcionario", dados.id_funcionario);
          if (user) {
            await user.delete();
          }
          response.json({ sucess: "true" });
        } else {
          response.json({ error: "Exclusão não permitida" });
        }
      } else {
        response.json({ error: "Funcionário não encontrado" });
      }
    } catch (error) {
      response.json(error);
    }
  }

  public async confirmPdf({ request, response, auth }: HttpContextContract) {
    try {
      const foto = request.file("foto");
      const data = request.body().data_pdf;

      if (foto && data) {
        let hashImg = crypto.randomBytes(10).toString("hex");
        let filename = `${hashImg}-${foto.clientName}`;
        let empresa = await Empresa.findBy("id_empresa", auth.user?.id_empresa);
        let s3Object = await upload({
          folder: "confirmaPdf",
          filename: filename,
          bucket: empresa?.bucket,
          path: filename,
          file: foto,
          type: foto.extname,
        });

        await ConfirmarPdf.create({
          id_funcionario: auth.user?.id_funcionario,
          foto: s3Object.Location,
          data_pdf: data,
        });

        response.json({ sucess: "Confirmado com sucesso!" });
      } else {
        response.badRequest({ error: "Foto e data são requeridos" });
      }
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async getVideos({ response, auth }: HttpContextContract) {
    try {
      const hoje = new Date();
      let dados = await Database.connection("pg").rawQuery(`
                SELECT * FROM ml_fol_md_video_funcionario video_func
                        INNER JOIN ml_md_video video ON(video_func.id_video = video.id_video)
                        WHERE video_func.id_funcionario = '${
                          auth.user?.id_funcionario
                        }'
                        AND (to_date(to_char(video.dt_expiracao,'DD/MM/YYYY'),'DD/MM/YYYY') >= to_date('${hoje.toLocaleDateString()}','DD/MM/YYYY')
                        OR video.dt_expiracao IS NULL
                        )
            `);

      response.json(dados.rows);
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async confirmarVideo({
    request,
    response,
    auth,
  }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create({
          id_video: schema.string(),
        }),
      });
      let dados = request.body();
      let video = await Database.connection("pg").rawQuery(`
        SELECT id_video_funcionario FROM ml_fol_md_video_funcionario video_func
        WHERE video_func.id_video_funcionario = '${dados.id_video}'
      `);
      if (video.rows[0]) {
        await Database.connection("pg")
          .table("ml_video_confirmed")
          .returning("id_video_confirmed")
          .insert({
            id_funcionario: auth.user?.id_funcionario,
            id_video: dados.id_video,
          });
        response.json({ sucess: "Confirmado com sucesso" });
      } else {
        response.badRequest({ error: "ID inválido" });
      }
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }

  public async avisoFerias({ response, auth }: HttpContextContract) {
    try {
      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );
      let retorno = await Database.connection("oracle").rawQuery(`
        select * from gudma.vw_ml_flp_aviso_ferias pf where pf.id_funcioario_erp = '${funcionario?.id_funcionario_erp}'
      `);
      response.json(retorno);
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }

  public async getParams({ response, auth }: HttpContextContract) {
    try {
      let retorno = await Database.connection("pg").rawQuery(`
        select * from ml_pla_parametro where id_empresa = '${auth.user?.id_empresa}'
      `);
      response.json(retorno.rows);
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }

  public async irpfAvaiables({ response, auth }: HttpContextContract) {
    try {
      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );

      let dadosIRPF = await Database.connection("oracle").rawQuery(`
        SELECT ANO FROM GUDMA.VW_ML_FLP_IRPF WHERE ID_FUNCIONARIO_ERP = '${funcionario?.id_funcionario_erp}'
        ORDER BY ANO DESC
      `);

      response.json(this.tratarIrpfAvaiables(dadosIRPF));
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }

  private tratarIrpfAvaiables(dados) {
    let retorno: any = [];
    dados.map((element) => retorno.push(element.ANO));
    return retorno;
  }

  public async vacation({ request, response, auth }: HttpContextContract) {
    try {
      let params = request.params();
      let competencia = params.competencia.split("-");
      competencia = competencia[1] + "/" + competencia[0];

      let funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );
      let dadosFerias = await Database.connection("oracle").rawQuery(`
        SELECT * FROM VW_ML_FLP_RECIBOFERIAS RF
        WHERE RF.ID_FUNCIONARIO_ERP = '${funcionario?.id_funcionario_erp}' AND RF.COMPETENCIA = '${competencia}'
      `);

      let dados = this.tratarDadosFerias(dadosFerias);
      return dados;

      // let pdfTemp = await this.generatePdf(dadosFerias[0], templateFERIAS);
      // let file = await uploadPdfEmpresa(
      //   pdfTemp.filename,
      //   auth.user?.id_empresa
      // );

      // if (file) {
      //   fs.unlink(pdfTemp.filename, () => {});
      //   response.json({ pdf: file.Location });
      // }
    } catch (error) {
      console.log(error);
      response.badRequest("Erro interno");
    }
  }

  private tratarDadosFerias(dados) {
    let dadosRetorno = [dados];

    // dados.forEach(element => {
    //   dadosRetorno.push(element)
    // });
    return dadosRetorno;
  }
}
