import { schema } from '@ioc:Adonis/Core/Validator';

export const GrupoSchemaInsert = {
    id_empresa_grupo : schema.number.nullableAndOptional(),
    id_empresa : schema.number.nullableAndOptional(),
    grupo : schema.string(),
    id_status : schema.number.nullableAndOptional()
}

export const GrupoSchemaUpdate = {
    id_grupo : schema.number(),
    id_empresa_grupo : schema.number.nullableAndOptional(),
    id_empresa : schema.number.nullableAndOptional(),
    grupo : schema.string.nullableAndOptional(),
    id_status : schema.number.nullableAndOptional()
}