"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaSchemaUpdate = exports.EmpresaSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.EmpresaSchema = {
    nomeempresarial: Validator_1.schema.string(),
    cnpj: Validator_1.schema.string(),
    logradouro: Validator_1.schema.string(),
    numero: Validator_1.schema.string.nullableAndOptional(),
    complemento: Validator_1.schema.string.nullableAndOptional(),
    cep: Validator_1.schema.string(),
    bairro: Validator_1.schema.string(),
    municipio: Validator_1.schema.string(),
    uf: Validator_1.schema.string(),
    email: Validator_1.schema.string.nullableAndOptional(),
    telefone: Validator_1.schema.string.nullableAndOptional(),
    situacaocadastral: Validator_1.schema.string(),
    contato: Validator_1.schema.string.nullableAndOptional(),
    id_grupo: Validator_1.schema.number(),
    id_usuario: Validator_1.schema.number.nullableAndOptional(),
    status: Validator_1.schema.number.nullableAndOptional(),
    background: Validator_1.schema.string.nullableAndOptional(),
    primary_color: Validator_1.schema.string.nullableAndOptional()
};
exports.EmpresaSchemaUpdate = {
    id_empresa: Validator_1.schema.number(),
    cnpj: Validator_1.schema.string.nullableAndOptional(),
    nomeempresarial: Validator_1.schema.string.nullableAndOptional(),
    logradouro: Validator_1.schema.string.nullableAndOptional(),
    numero: Validator_1.schema.string.nullableAndOptional(),
    complemento: Validator_1.schema.string.nullableAndOptional(),
    cep: Validator_1.schema.string.nullableAndOptional(),
    bairro: Validator_1.schema.string.nullableAndOptional(),
    municipio: Validator_1.schema.string.nullableAndOptional(),
    uf: Validator_1.schema.string.nullableAndOptional(),
    email: Validator_1.schema.string.nullableAndOptional(),
    telefone: Validator_1.schema.string.nullableAndOptional(),
    situacaocadastral: Validator_1.schema.string.nullableAndOptional(),
    contato: Validator_1.schema.string.nullableAndOptional(),
    id_grupo: Validator_1.schema.number.nullableAndOptional(),
    id_usuario: Validator_1.schema.number.nullableAndOptional(),
    status: Validator_1.schema.number.nullableAndOptional(),
    background: Validator_1.schema.string.nullableAndOptional(),
    primary_color: Validator_1.schema.string.nullableAndOptional()
};
//# sourceMappingURL=Empresa.js.map