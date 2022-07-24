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