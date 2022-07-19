import { schema } from '@ioc:Adonis/Core/Validator';

export const EmpresaSchema = {
    nomeempresarial: schema.string(),
    cnpj: schema.string(),
    logradouro: schema.string(),
    numero: schema.number(),
    complemento: schema.string(),
    cep: schema.string(),
    bairro: schema.string(),
    municipio: schema.string(),
    uf : schema.string(),
    email: schema.string(),
    telefone: schema.string(),
    situacaocadastral: schema.string.nullable(),
    contato: schema.string.nullable(),
    id_grupo : schema.number(),
    id_usuario : schema.number.nullable(),
    status: schema.number.nullable(),
    background: schema.string.nullable(),
    primary_color: schema.string.nullable(),
    logo : schema.string.nullable()
};