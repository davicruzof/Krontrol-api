import Database from "@ioc:Adonis/Lucid/Database";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class MessagesController {
  public getComunications = async ({
    response,
    request,
  }: HttpContextContract) => {
    try {
      const { funcionario_erp_id, id_empresa } = request.body();

      if (!funcionario_erp_id || !id_empresa) {
        return response.badRequest({
          message: "Dados do funcionário ou empresa não informados",
        });
      }

      const query = `
                SELECT
                m.*,
                (
                    SELECT row_to_json(c)
                    FROM public.ml_avi_conteudo c
                    WHERE c.id = m.conteudo_id AND c.inativo = false
                ) as conteudo,
                (
                    SELECT row_to_json(a)
                    FROM public.ml_avi_acao a
                    WHERE a.id = m.acao_id
                ) as acao
                FROM public.ml_avi_mensagem m
                WHERE m.funcionario_erp_id = ?
                AND m.empresa_id = ?
                AND m.dt_leitura_confirmacao IS NULL
                ORDER BY m.dt_cadastro DESC
            `;

      const result = await Database.connection("pg").rawQuery(query, [
        funcionario_erp_id,
        id_empresa,
      ]);

      return response.ok({ messages: result.rows });
    } catch (error) {
      console.error("Error on getComunications:", error);
      return response.internalServerError({
        message: "Ocorreu um erro ao buscar as comunicações",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  public viewMessage = async ({ response, request }: HttpContextContract) => {
    try {
      const { id } = request.body();

      if (!id) {
        return response.badRequest({ message: "ID da mensagem não informado" });
      }

      const query = `
                UPDATE public.ml_avi_mensagem
                SET dt_visualizacao = now()
                WHERE id = ?
            `;

      await Database.connection("pg").rawQuery(query, [id]);

      return response.ok({ message: "Mensagem visualizada" });
    } catch (error) {
      console.error("Error on viewMessage:", error);
      return response.internalServerError({
        message: "Ocorreu um erro ao visualizar a mensagem",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  public viewHoleriteMessage = async ({
    response,
    request,
  }: HttpContextContract) => {
    try {
      const { competencia } = request.body();

      if (!competencia) {
        return response.badRequest({ message: "Competência não informada" });
      }

      const query = `
                UPDATE public.ml_avi_mensagem
                SET holerite_dt_visualizacao = now()
                WHERE holerite_competencia = ?
                AND holerite = true
                AND holerite_dt_visualizacao IS NULL
            `;

      await Database.connection("pg").rawQuery(query, [competencia]);

      return response.ok({ message: "Mensagem visualizada no Holerite" });
    } catch (error) {
      console.error("Error on viewHoleriteMessage:", error);
      return response.internalServerError({
        message: "Ocorreu um erro ao visualizar a mensagem no Holerite",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

  public confirmMessage = async ({
    response,
    request,
  }: HttpContextContract) => {
    try {
      const { id } = request.body();

      if (!id) {
        return response.badRequest({ message: "ID da mensagem não informado" });
      }

      const query = `
                UPDATE public.ml_avi_mensagem
                SET dt_leitura_confirmacao = now()
                WHERE id = ?
            `;

      await Database.connection("pg").rawQuery(query, [id]);

      return response.ok({ message: "Mensagem confirmada" });
    } catch (error) {
      console.error("Error on confirmMessage:", error);
      return response.internalServerError({
        message: "Ocorreu um erro ao confirmar a mensagem",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
}
