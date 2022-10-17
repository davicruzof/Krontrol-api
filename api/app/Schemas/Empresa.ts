import { schema } from '@ioc:Adonis/Core/Validator';

export const EmpresaSchema = {
    nomeempresarial: schema.string(),
    cnpj: schema.string(),
    logradouro: schema.string(),
    numero: schema.number.nullable(),
    complemento: schema.string.nullable(),
    cep: schema.string(),
    bairro: schema.string(),
    municipio: schema.string(),
    uf : schema.string(),
    email: schema.string.nullableAndOptional(),
    telefone: schema.string.nullableAndOptional(),
    situacaocadastral: schema.string.nullableAndOptional(),
    contato: schema.string.nullableAndOptional(),
    id_grupo : schema.number(),
    id_usuario : schema.number.nullableAndOptional(),
    status: schema.number.nullableAndOptional(),
    background: schema.string.nullableAndOptional(),
    primary_color: schema.string.nullableAndOptional()
};


export const EmpresaSchemaUpdate = {
    id_empresa : schema.number(),
    nomeempresarial: schema.string.nullableAndOptional(),
    cnpj: schema.string(),
    logradouro: schema.string.nullableAndOptional(),
    numero: schema.number.nullableAndOptional(),
    complemento: schema.string.nullableAndOptional(),
    cep: schema.string.nullableAndOptional(),
    bairro: schema.string.nullableAndOptional(),
    municipio: schema.string.nullableAndOptional(),
    uf : schema.string.nullableAndOptional(),
    email: schema.string.nullableAndOptional(),
    telefone: schema.string.nullableAndOptional(),
    situacaocadastral: schema.string.nullableAndOptional(),
    contato: schema.string.nullableAndOptional(),
    id_grupo : schema.number.nullableAndOptional(),
    id_usuario : schema.number.nullableAndOptional(),
    status: schema.number.nullableAndOptional(),
    background: schema.string.nullableAndOptional(),
    primary_color: schema.string.nullableAndOptional()
};