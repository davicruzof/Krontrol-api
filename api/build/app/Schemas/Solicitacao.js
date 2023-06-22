"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitacaoRespostaGetIdSchema = exports.SolicitacaoRespostaSchema = exports.solicitacaoSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.solicitacaoSchema = {
    id_area: Validator_1.schema.number(),
    id_modulo: Validator_1.schema.number(),
    justificativa: Validator_1.schema.string(),
};
exports.SolicitacaoRespostaSchema = {
    id_solicitacao: Validator_1.schema.number(),
    justificativa: Validator_1.schema.string(),
    dt_resposta: Validator_1.schema.string(),
    id_status_leitura: Validator_1.schema.number(),
    respondido_por: Validator_1.schema.number(),
    url_documento: Validator_1.schema.string.nullableAndOptional(),
};
exports.SolicitacaoRespostaGetIdSchema = {
    id_solicitacao: Validator_1.schema.number(),
};
//# sourceMappingURL=Solicitacao.js.map