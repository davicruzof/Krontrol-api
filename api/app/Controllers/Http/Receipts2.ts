import Empresa from "App/Models/Empresa";
import ConfirmarPdf from "App/Models/ConfirmarPdf";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Funcionario from "../../Models/Funcionario";
import pdf from "pdf-creator-node";
import fs from "fs";
import { uploadPdfEmpresa } from "App/Controllers/Http/S3";
import Database from "@ioc:Adonis/Lucid/Database";
import { fichaPonto } from "App/templates/pdf/template";
import AppVersion from "App/Models/AppVersion";
import { DateTime } from "luxon";

export default class Receipts2 {
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

  private tratarDadosDotCard(dados, dados_empresa, resumoFicha) {
    const ultimaPosicao = dados.length - 1;
    let dadosTemp = {
      cabecalho: {
        logo: dados_empresa.logo,
        nomeEmpresa: dados_empresa.nomeempresarial,
        cnpj: dados_empresa.cnpj,
        nome: dados[ultimaPosicao].NOME,
        funcao: dados[ultimaPosicao].FUNCAO,
        competencia: dados[ultimaPosicao].BH_COMPETENCIA,
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
        return response.badRequest({ error: "data is required" });
      }

      const data = `${dados.data.year}/dados.data.month}`;
      const competencia = `${dados.data.month}/dados.data.year}`;

      const dateRequestInitial = DateTime.fromISO(
        new Date(`${data}-27`).toISOString().replace(".000Z", "")
      )
        .minus({ months: 1 })
        .toFormat("dd/LL/yyyy")
        .toString();

      const dateRequestFinish = DateTime.fromISO(
        new Date(`${data}-26`).toISOString().replace(".000Z", "")
      )
        .toFormat("dd/LL/yyyy")
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
        return response.badRequest({ error: "app desatualizado" });
      }

      const empresa = await Empresa.findBy("id_empresa", auth.user?.id_empresa);

      if (!empresa) {
        return response.badRequest({ error: "Erro ao pegar empresa!" });
      }

      const query = await Database.connection("oracle").rawQuery(`
        SELECT DISTINCT *
          FROM GUDMA.VW_ML_FICHAPONTO_PDF F
          WHERE F.ID_FUNCIONARIO_ERP = '${funcionario.id_funcionario_erp}'
          AND F.DATA_MOVIMENTO BETWEEN to_date('${dateRequestInitial}','DD-MM-YYYY') and to_date('${dateRequestFinish}','DD-MM-YYYY')
          ORDER BY F.DATA_MOVIMENTO
      `);

      if (query.rows.length === 0) {
        return response.badRequest({
          error: "Nenhum dado de ficha ponto foi encontrado!",
        });
      }

      let resumoFicha = await Database.connection("oracle").rawQuery(`
          SELECT DISTINCT EVENTO, TRIM(HR_DIA) as HR_DIA
          FROM
            VW_ML_PON_RESUMO_HOLERITE FH
          WHERE FH.ID_FUNCIONARIO_ERP = '${funcionario?.id_funcionario_erp}'
          AND FH.COMPETENCIA = '${competencia}'
        `);

      const pdfTemp = await this.generatePdf(
        this.tratarDadosDotCard(query, empresa, resumoFicha),
        fichaPonto
      );

      if (!pdfTemp) {
        return response.badRequest({ error: "Erro ao gerar pdf!" });
      }

      const confirmacao = await ConfirmarPdf.query()
        .select("*")
        .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
        .andWhere("data_pdf", "=", `${competencia}`);

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
