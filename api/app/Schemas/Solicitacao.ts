import { schema } from "@ioc:Adonis/Core/Validator";

export const solicitacaoSchema = {
  id_area: schema.number(),
  id_modulo: schema.number(),
  justificativa: schema.string(),
};

export const SolicitacaoRespostaSchema = {
  id_solicitacao: schema.number(),

  justificativa: schema.string(),

  dt_resposta: schema.string(),

  id_status_leitura: schema.number(),

  respondido_por: schema.number(),

  url_documento: schema.string.nullableAndOptional(),
};

export const SolicitacaoRespostaGetIdSchema = {
  id_solicitacao: schema.number(),
};
