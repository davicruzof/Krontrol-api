"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoSchemaUpdate = exports.GrupoSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.GrupoSchemaInsert = {
    id_empresa_grupo: Validator_1.schema.number.nullableAndOptional(),
    id_empresa: Validator_1.schema.number.nullableAndOptional(),
    grupo: Validator_1.schema.string(),
    id_status: Validator_1.schema.number.nullableAndOptional()
};
exports.GrupoSchemaUpdate = {
    id_grupo: Validator_1.schema.number(),
    id_empresa_grupo: Validator_1.schema.number.nullableAndOptional(),
    id_empresa: Validator_1.schema.number.nullableAndOptional(),
    grupo: Validator_1.schema.string.nullableAndOptional(),
    id_status: Validator_1.schema.number.nullableAndOptional()
};
//# sourceMappingURL=Grupo.js.map