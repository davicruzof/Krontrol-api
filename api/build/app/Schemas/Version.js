"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.AppVersionInsert = {
    id_empresa: Validator_1.schema.number.nullableAndOptional(),
    id_funcionario: Validator_1.schema.number.nullableAndOptional(),
    so: Validator_1.schema.string.nullableAndOptional(),
    app_version: Validator_1.schema.string.nullableAndOptional(),
};
//# sourceMappingURL=Version.js.map