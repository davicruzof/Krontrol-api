
import { schema } from '@ioc:Adonis/Core/Validator';


export const FuncionarioSchemaInsert = {
    id_grupo: schema.number(),

    id_empresa: schema.number(),

    nome : schema.string(),

    registro : schema.string.nullable(),

    id_funcionario_erp : schema.number.nullable(),

    id_funcao : schema.number(),

    id_cnh : schema.number.nullable(),

    cpf: schema.string(),

    celular : schema.string(),

    email : schema.string(),

    rfid : schema.string.nullable(),

    id_situacao : schema.number.nullable(),

    cnh_emissao : schema.date.nullable(),

    id_funcionario_cadastro : schema.date.nullable(),

    dt_nascimento : schema.date(),    

    id_sexo : schema.number(),
    
    pis : schema.string()
}

export const updateProfileFuncionario = {
    nome: schema.string.nullableAndOptional(),
    dt_nascimento: schema.date.nullableAndOptional(),
    email: schema.string.nullableAndOptional(),
    celular: schema.string.nullableAndOptional()
}