"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeiculoSchemaUpdate = exports.VeiculoSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.VeiculoSchemaInsert = {
    chassi: Validator_1.schema.string(),
    id_grupo: Validator_1.schema.number(),
    id_empresa: Validator_1.schema.number(),
    id_garagem: Validator_1.schema.number.nullableAndOptional(),
    id_erp: Validator_1.schema.number.nullableAndOptional(),
    prefixo: Validator_1.schema.string.nullableAndOptional(),
    placa: Validator_1.schema.string(),
    ano_fabricacao: Validator_1.schema.date(),
    ano_modelo: Validator_1.schema.date(),
    modelo: Validator_1.schema.string(),
    media_consumo: Validator_1.schema.number.nullableAndOptional(),
    id_status: Validator_1.schema.number.nullableAndOptional(),
    id_destinacao: Validator_1.schema.number.nullableAndOptional(),
    foto: Validator_1.schema.file.nullableAndOptional()
};
exports.VeiculoSchemaUpdate = {
    id_veiculo: Validator_1.schema.number(),
    chassi: Validator_1.schema.string(),
    id_grupo: Validator_1.schema.number(),
    id_empresa: Validator_1.schema.number(),
    id_garagem: Validator_1.schema.number.nullable(),
    id_erp: Validator_1.schema.number.nullable(),
    prefixo: Validator_1.schema.string.nullable(),
    placa: Validator_1.schema.string(),
    ano_fabricacao: Validator_1.schema.date(),
    ano_modelo: Validator_1.schema.date(),
    modelo: Validator_1.schema.string(),
    media_consumo: Validator_1.schema.number.nullable(),
    id_status: Validator_1.schema.number.nullable(),
    id_destinacao: Validator_1.schema.number.nullable(),
    foto: Validator_1.schema.file.nullableAndOptional()
};
//# sourceMappingURL=Veiculo.js.map