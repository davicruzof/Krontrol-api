
import { schema } from '@ioc:Adonis/Core/Validator';


export const UserSchemaInsert = {
    cpf: schema.string(),
    id_empresa: schema.number(),
    dt_nascimento: schema.date(),
    id_grupo: schema.number.nullable(),
    senha : schema.string()
}