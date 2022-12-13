
import { schema } from '@ioc:Adonis/Core/Validator';


export const VeiculoSchemaInsert = {
    chassi : schema.string(),
    id_grupo : schema.number(),
    id_empresa : schema.number(),
    id_garagem : schema.number.nullable(),
    id_erp : schema.number.nullable(),
    prefixo : schema.string.nullable(),
    placa : schema.string(),
    ano_fabricacao : schema.date(),
    ano_modelo : schema.date(),
    modelo : schema.string(),
    media_consumo : schema.number.nullable(),
    id_status : schema.number.nullable(),
    id_destinacao : schema.number.nullable(),
    foto  : schema.file()
}
export const VeiculoSchemaUpdate = {
    id_veiculo : schema.number(),
    chassi : schema.string(),
    id_grupo : schema.number(),
    id_empresa : schema.number(),
    id_garagem : schema.number.nullable(),
    id_erp : schema.number.nullable(),
    prefixo : schema.string.nullable(),
    placa : schema.string(),
    ano_fabricacao : schema.date(),
    ano_modelo : schema.date(),
    modelo : schema.string(),
    media_consumo : schema.number.nullable(),
    id_status : schema.number.nullable(),
    id_destinacao : schema.number.nullable(),
    foto  : schema.file()
}