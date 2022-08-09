import { schema } from '@ioc:Adonis/Core/Validator';

export const GrupoEventoSchemaInsert = {

    id_empresa_grupo : schema.number.nullableAndOptional(),
    id_empresa : schema.number(),
    id_telemetria_grupo : schema.number(),
    id_telemetria_evento : schema.number(),
    id_status : schema.number.nullableAndOptional()
    
}