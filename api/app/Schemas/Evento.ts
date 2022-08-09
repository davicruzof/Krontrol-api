import { schema } from '@ioc:Adonis/Core/Validator';

export const EventoSchemaInsert = {

    id_evento_telemetria : schema.number.nullableAndOptional(),
    evento : schema.string(),
    id_empresa_telemetria : schema.number.nullableAndOptional()

}