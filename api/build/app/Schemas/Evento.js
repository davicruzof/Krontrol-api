"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoSchemaUpdate = exports.EventoSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.EventoSchemaInsert = {
    id_evento_telemetria: Validator_1.schema.number.nullableAndOptional(),
    evento: Validator_1.schema.string(),
    id_empresa_telemetria: Validator_1.schema.number.nullableAndOptional()
};
exports.EventoSchemaUpdate = {
    id_evento: Validator_1.schema.number(),
    id_evento_telemetria: Validator_1.schema.number.nullableAndOptional(),
    evento: Validator_1.schema.string(),
    id_empresa_telemetria: Validator_1.schema.number.nullableAndOptional()
};
//# sourceMappingURL=Evento.js.map