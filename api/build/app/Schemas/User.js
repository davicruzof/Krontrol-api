"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.UserSchemaInsert = {
    cpf: Validator_1.schema.string(),
    id_empresa: Validator_1.schema.number(),
    dt_nascimento: Validator_1.schema.date(),
    id_grupo: Validator_1.schema.number.nullable(),
    senha: Validator_1.schema.string()
};
//# sourceMappingURL=User.js.map