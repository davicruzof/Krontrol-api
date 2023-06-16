import { schema } from "@ioc:Adonis/Core/Validator";

export const SolicitacaoRespostaSchema = {
  id_solicitacao: schema.number(),

  justificativa: schema.string(),

  dt_resposta: schema.string(),

  id_status_leitura: schema.number(),

  respondido_por: schema.number(),

  url_documento: schema.string.nullableAndOptional(),
};
