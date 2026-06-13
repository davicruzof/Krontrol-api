"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class MessagesController {
    constructor() {
        this.getComunications = async ({ response, request, }) => {
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
                const result = await Database_1.default.connection("pg").rawQuery(query, [
                    funcionario_erp_id,
                    id_empresa,
                ]);
                return response.ok({ messages: result.rows });
            }
            catch (error) {
                console.error("Error on getComunications:", error);
                return response.internalServerError({
                    message: "Ocorreu um erro ao buscar as comunicações",
                    error: process.env.NODE_ENV === "development" ? error.message : undefined,
                });
            }
        };
        this.viewMessage = async ({ response, request }) => {
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
                await Database_1.default.connection("pg").rawQuery(query, [id]);
                return response.ok({ message: "Mensagem visualizada" });
            }
            catch (error) {
                console.error("Error on viewMessage:", error);
                return response.internalServerError({
                    message: "Ocorreu um erro ao visualizar a mensagem",
                    error: process.env.NODE_ENV === "development" ? error.message : undefined,
                });
            }
        };
        this.viewHoleriteMessage = async ({ response, request, }) => {
            try {
                const { id } = request.body();
                if (!id) {
                    return response.badRequest({ message: "Dados não informados" });
                }
                const query = `
                UPDATE public.ml_avi_mensagem
                SET holerite_dt_visualizacao = now()
                WHERE id = ?
                AND holerite_dt_visualizacao IS NULL
            `;
                await Database_1.default.connection("pg").rawQuery(query, [id]);
                return response.ok({ message: "Mensagem visualizada no Holerite" });
            }
            catch (error) {
                console.error("Error on viewHoleriteMessage:", error);
                return response.internalServerError({
                    message: "Ocorreu um erro ao visualizar a mensagem no Holerite",
                    error: process.env.NODE_ENV === "development" ? error.message : undefined,
                });
            }
        };
        this.confirmMessage = async ({ response, request, }) => {
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
                await Database_1.default.connection("pg").rawQuery(query, [id]);
                return response.ok({ message: "Mensagem confirmada" });
            }
            catch (error) {
                console.error("Error on confirmMessage:", error);
                return response.internalServerError({
                    message: "Ocorreu um erro ao confirmar a mensagem",
                    error: process.env.NODE_ENV === "development" ? error.message : undefined,
                });
            }
        };
    }
}
exports.default = MessagesController;
//# sourceMappingURL=MessagesController.js.map