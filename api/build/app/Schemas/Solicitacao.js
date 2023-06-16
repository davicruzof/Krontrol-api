"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitacaoRespostaSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.SolicitacaoRespostaSchema = {
    id_solicitacao: Validator_1.schema.number(),
    justificativa: Validator_1.schema.string(),
    dt_resposta: Validator_1.schema.string(),
    id_status_leitura: Validator_1.schema.number(),
    respondido_por: Validator_1.schema.number(),
    url_documento: Validator_1.schema.string.nullableAndOptional(),
};
//# sourceMappingURL=Solicitacao.js.map