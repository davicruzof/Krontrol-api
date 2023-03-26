"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoEventoSchemaUpdate = exports.GrupoEventoSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.GrupoEventoSchemaInsert = {
    id_empresa_grupo: Validator_1.schema.number.nullableAndOptional(),
    id_empresa: Validator_1.schema.number(),
    id_telemetria_grupo: Validator_1.schema.number(),
    id_telemetria_evento: Validator_1.schema.number(),
    id_status: Validator_1.schema.number.nullableAndOptional(),
    id_telemetria_trip: Validator_1.schema.number()
};
exports.GrupoEventoSchemaUpdate = {
    id_associacao: Validator_1.schema.number(),
    id_empresa_grupo: Validator_1.schema.number.nullableAndOptional(),
    id_empresa: Validator_1.schema.number(),
    id_telemetria_grupo: Validator_1.schema.number(),
    id_telemetria_evento: Validator_1.schema.number(),
    id_status: Validator_1.schema.number.nullableAndOptional(),
    id_telemetria_trip: Validator_1.schema.number()
};
//# sourceMappingURL=GrupoEvento.js.map