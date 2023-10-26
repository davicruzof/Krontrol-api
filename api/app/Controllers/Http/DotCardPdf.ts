import Empresa from "App/Models/Empresa";
import ConfirmarPdf from "App/Models/ConfirmarPdf";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Funcionario from "../../Models/Funcionario";
import pdf from "pdf-creator-node";
import fs from "fs";
import { uploadPdfEmpresa } from "App/Controllers/Http/S3";
import Database from "@ioc:Adonis/Lucid/Database";
import AppVersion from "App/Models/AppVersion";
import { DateTime } from "luxon";
import { Template_Ficha_Ponto } from "App/templates/pdf/template_ficha_ponto";
import RequestFichaPonto from "./RequestFicha";

export default class DotCardPdf {
  private async generatePdf(dados, template) {
    try {
      var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        type: "pdf",
      };

      const filename = Math.random() + "_doc" + ".pdf";

      var document = {
        html: template,
        data: {
          dados: dados,
        },
        path: "./pdfsTemp/" + filename,
      };

      let file = pdf
        .create(document, options)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          return error;
        });
      return await file;
    } catch (error) {}
  }

  private isMonthFreedom = async (id_empresa, id_pdf, mes) => {
    const liberacaoPdf = await Database.connection("pg").rawQuery(
      `SELECT * FROM public.vw_ml_flp_liberacao_recibos 
            where tipo_id = ${id_pdf} 
            AND bloqueio_liberacao = false
            AND mes_liberado = '${mes}'
            AND empresa_id = ${id_empresa}
            `
    );

    return liberacaoPdf?.rows.length > 0 ? true : false;
  };

  private tratarDadosDotCard(dados, dados_empresa, resumoFicha, competencia) {
    const ultimaPosicao = dados.length - 1;
    let dadosTemp = {
      cabecalho: {
        logo: dados_empresa.logo,
        nomeEmpresa: dados_empresa.nomeempresarial,
        cnpj: dados_empresa.cnpj,
        nome: dados[ultimaPosicao].NOME,
        funcao: dados[ultimaPosicao].FUNCAO,
        competencia: competencia,
        endereco: dados_empresa.logradouro,
      },
      rodape: {
        saldoAnterior: dados[ultimaPosicao].SALDOANTERIOR,
        credito: dados[ultimaPosicao].CREDITO,
        debito: dados[ultimaPosicao].DEBITO,
        valorPago: dados[ultimaPosicao].VALORPAGO,
        saldoAtual: dados[ultimaPosicao].SALDOATUAL,
      },
      dadosDias: new Array(),
      resumo: resumoFicha,
    };
    dados.forEach((element) => {
      element.TOTALF = element.TOTALF;
      element.EXTRA = element.EXTRA;
      element.OUTRA = element.OUTRA;
      dadosTemp.dadosDias.push(element);
    });
    return dadosTemp;
  }

  public async dotCardPdfGenerator({
    request,
    response,
    auth,
  }: HttpContextContract) {
    try {
      const dados = request.body();

      if (!dados.data || !auth.user) {
        return response.badRequest({
          error: "Não foi possivel consultar sua ficha ponto!",
        });
      }

      const data = `${dados.data.year}/${dados.data.month}`;
      const competencia = `${dados.data.month}/${dados.data.year}`;

      const dateRequestInitial = DateTime.fromISO(
        new Date(`${data}/27`).toISOString().replace(".000Z", "")
      )
        .minus({ months: 1 })
        .toFormat("dd-LL-yyyy")
        .toString();

      const dateRequestFinish = DateTime.fromISO(
        new Date(`${data}/26`).toISOString().replace(".000Z", "")
      )
        .toFormat("dd-LL-yyyy")
        .toString();

      const isMonthReleased = await this.isMonthFreedom(
        auth.user?.id_empresa,
        1,
        competencia
      );

      if (!isMonthReleased) {
        return response.badRequest({
          error: "Empresa não liberou para gerar o recibo",
        });
      }

      const funcionario = await Funcionario.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );

      if (!funcionario) {
        return response.badRequest({ error: "funcionario não encontrado!" });
      }

      const appUpdate = await AppVersion.findBy(
        "id_funcionario",
        auth.user?.id_funcionario
      );

      if (!appUpdate) {
        return response.badRequest({ error: "O seu app desatualizado!" });
      }

      const empresa = await Empresa.findBy("id_empresa", auth.user?.id_empresa);

      if (!empresa) {
        return response.badRequest({ error: "Erro ao pegar empresa!" });
      }

      const query = await RequestFichaPonto(
        funcionario.id_funcionario_erp,
        dateRequestInitial,
        dateRequestFinish
      );

      if (query.length === 0) {
        return response.badRequest({
          error:
            "Não foi possivel gerar a sua ficha ponto! Tente novamente mais tarde",
        });
      }

      const formattedData = query.map((obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] === null) {
            obj[key] = "--------";
          }
        });
        return obj;
      });

      let resumoFicha = [];

      try {
        resumoFicha = await Database.connection("oracle").rawQuery(`
          SELECT DISTINCT EVENTO, TRIM(HR_DIA) as HR_DIA
          FROM
            VW_ML_PON_RESUMO_HOLERITE FH
          WHERE FH.ID_FUNCIONARIO_ERP = '${funcionario?.id_funcionario_erp}'
          AND FH.COMPETENCIA = '${competencia}'
        `);
      } catch (error) {
        resumoFicha = [];
      }

      const pdfTemp = await this.generatePdf(
        this.tratarDadosDotCard(
          formattedData,
          empresa,
          resumoFicha,
          competencia
        ),
        Template_Ficha_Ponto
      );

      if (!pdfTemp) {
        return response.badRequest({ error: "Erro ao gerar pdf!" });
      }

      const confirmacao = await ConfirmarPdf.query()
        .select("*")
        .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
        .andWhere("data_pdf", "=", `${data}`);

      if (!confirmacao) {
        return response.badRequest({ error: "Erro ao verificar confirmação!" });
      }

      const file = await uploadPdfEmpresa(
        pdfTemp.filename,
        auth.user?.id_empresa
      );

      if (!file) {
        return response.badRequest({ error: "Erro ao gerar url do pdf!" });
      }

      fs.unlink(pdfTemp.filename, () => {});
      response.json({
        pdf: file.Location,
        confirmado: confirmacao[0] ? true : false,
      });
    } catch (error) {
      response.badRequest(error);
    }
  }
}
