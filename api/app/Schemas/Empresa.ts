import { schema } from '@ioc:Adonis/Core/Validator';

export const EmpresaSchema = {
    nomeempresarial: schema.string(),
    cnpj: schema.string(),
    logradouro: schema.string(),
    numero: schema.string.nullableAndOptional(),
    complemento: schema.string.nullableAndOptional(),
    cep: schema.string(),
    bairro: schema.string(),
    municipio: schema.string(),
    uf : schema.string(),
    email: schema.string.nullableAndOptional(),
    telefone: schema.string.nullableAndOptional(),
    situacaocadastral: schema.string(),
    contato: schema.string.nullableAndOptional(),
    id_grupo : schema.number(),
    id_usuario : schema.number.nullableAndOptional(),
    status: schema.number.nullableAndOptional(),
    background: schema.string.nullableAndOptional(),
    primary_color: schema.string.nullableAndOptional()
};


export const EmpresaSchemaUpdate = {
    id_empresa : schema.number(),
    cnpj: schema.string.nullableAndOptional(),
    nomeempresarial: schema.string.nullableAndOptional(),
    logradouro: schema.string.nullableAndOptional(),
    numero: schema.string.nullableAndOptional(),
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