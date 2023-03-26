"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileFuncionario = exports.FuncionarioSchemaInsert = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.FuncionarioSchemaInsert = {
    id_grupo: Validator_1.schema.number(),
    id_empresa: Validator_1.schema.number(),
    nome: Validator_1.schema.string(),
    registro: Validator_1.schema.string.nullable(),
    id_funcionario_erp: Validator_1.schema.number.nullable(),
    id_funcao: Validator_1.schema.number(),
    id_cnh: Validator_1.schema.number.nullable(),
    cpf: Validator_1.schema.string(),
    celular: Validator_1.schema.string(),
    email: Validator_1.schema.string(),
    rfid: Validator_1.schema.string.nullable(),
    id_situacao: Validator_1.schema.number.nullable(),
    cnh_emissao: Validator_1.schema.date.nullable(),
    id_funcionario_cadastro: Validator_1.schema.date.nullable(),
    dt_nascimento: Validator_1.schema.date(),
    id_sexo: Validator_1.schema.number(),
    pis: Validator_1.schema.string()
};
exports.updateProfileFuncionario = {
    nome: Validator_1.schema.string.nullableAndOptional(),
    dt_nascimento: Validator_1.schema.date.nullableAndOptional(),
    email: Validator_1.schema.string.nullableAndOptional(),
    celular: Validator_1.schema.string.nullableAndOptional()
};
//# sourceMappingURL=Funcionario.js.map